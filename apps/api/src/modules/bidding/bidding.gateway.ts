import { Logger, UnauthorizedException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BiddingService } from './bidding.service';
import { PlaceBidDto } from './dto/place-bid.dto';
import { SOCKET_EVENTS } from './bidding.constants';
import { BIDDING_EVENTS, BidAcceptedEvent } from './events/bidding.events';
import { AUCTION_EVENTS, AuctionEndedEvent } from '../auctions/events/auction.events';
import type { AccessTokenPayload } from '../auth/types/authenticated-user.type';

interface AuthenticatedSocket extends Socket {
  data: { userId: string };
}

/**
 * Tech stack §3 says "namespace per auction room" — taken here as "one
 * addressable channel per auction," which in Socket.io's actual terms means
 * one ROOM per auction id within a single namespace, not a literal distinct
 * Socket.io namespace per auction. A namespace per (potentially thousands
 * of) auctions doesn't scale and isn't how Socket.io is meant to be used;
 * rooms are the idiomatic mechanism for exactly this "many dynamic,
 * high-cardinality channels" case. Everything bidding-related lives under
 * one dedicated namespace, `/bidding`, separate from any other future
 * WebSocket use in the app.
 */
@WebSocketGateway({
  namespace: 'bidding',
  cors: { origin: '*', credentials: true }, // tightened at the adapter/app level via CORS_ORIGINS in production
  pingInterval: 30000, // tech stack §3: 30s heartbeat
  pingTimeout: 20000,
})
export class BiddingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(BiddingGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly biddingService: BiddingService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * No passport/HTTP guard pipeline applies to WebSocket connections, so
   * auth is done by hand here: verify the JWT the client sends in the
   * handshake, same RS256 public key as the REST API, and disconnect
   * immediately if it's missing or invalid. socket.data.userId is then
   * trusted for the rest of this connection's lifetime.
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      const payload = this.jwtService.verify<AccessTokenPayload>(token);
      (client as AuthenticatedSocket).data.userId = payload.sub;
    } catch (err) {
      this.logger.warn(`Rejected WebSocket connection: ${(err as Error).message}`);
      client.emit(SOCKET_EVENTS.BID_REJECTED, { error: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Socket disconnected: ${client.id}`);
  }

  private extractToken(client: Socket): string {
    const fromAuth = client.handshake.auth?.token as string | undefined;
    const fromHeader = client.handshake.headers.authorization;
    const raw = fromAuth ?? fromHeader;
    if (!raw) throw new UnauthorizedException('No token provided');
    return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  }

  /**
   * Joins the room for one auction. If the client provides `lastEventId`
   * (they were connected before, then dropped), replays everything they
   * missed from the Redis Stream before they start receiving live events —
   * this is the actual "don't just reconnect and hope" mechanism tech stack
   * §3 asks for.
   */
  @SubscribeMessage('joinAuction')
  async joinAuction(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: { auctionId: string; lastEventId?: string },
  ): Promise<{ replayed: number }> {
    const room = this.roomFor(body.auctionId);

    let replayed = 0;
    if (body.lastEventId) {
      const missed = await this.biddingService.getReplayEvents(body.auctionId, body.lastEventId);
      for (const entry of missed) {
        client.emit(SOCKET_EVENTS.BID_PLACED, { streamId: entry.streamId, ...entry.event });
      }
      replayed = missed.length;
    }

    await client.join(room);
    return { replayed };
  }

  @SubscribeMessage('leaveAuction')
  async leaveAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { auctionId: string },
  ): Promise<void> {
    await client.leave(this.roomFor(body.auctionId));
  }

  /**
   * The socket path into the same placeBid logic the REST endpoint uses
   * (see bidding.controller.ts) — tech stack describes bids arriving "over
   * the socket," the PRD's API list documents a REST endpoint; both call
   * BiddingService.placeBid so neither path can drift from the other.
   * Responds via ack callback directly to the caller; the room-wide
   * broadcast to everyone else happens via the BID_ACCEPTED event listener
   * below, triggered by the same call.
   */
  @SubscribeMessage('placeBid')
  async placeBid(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() body: { auctionId: string; amount: number },
  ): Promise<{ accepted: boolean; [key: string]: unknown }> {
    const dto = new PlaceBidDto();
    dto.amount = body.amount;

    try {
      const result = await this.biddingService.placeBid(
        body.auctionId,
        client.data.userId,
        dto.amount,
      );
      return { ...result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bid could not be placed';
      return { accepted: false, error: message };
    }
  }

  @OnEvent(BIDDING_EVENTS.BID_ACCEPTED)
  handleBidAccepted(event: BidAcceptedEvent): void {
    this.server.to(this.roomFor(event.auctionId)).emit(SOCKET_EVENTS.BID_PLACED, {
      bidId: event.bidId,
      amount: event.amount,
      bidderTag: event.bidderTag,
      createdAt: event.createdAt,
      endTime: event.endTime,
      extensionsUsed: event.extensionsUsed,
      wasExtended: event.wasExtended,
    });
  }

  @OnEvent(AUCTION_EVENTS.ENDED)
  handleAuctionEnded(event: AuctionEndedEvent): void {
    this.server.to(this.roomFor(event.auctionId)).emit(SOCKET_EVENTS.AUCTION_ENDED, {
      auctionId: event.auctionId,
      winningBid: event.winningBid,
    });
  }

  private roomFor(auctionId: string): string {
    return `auction:${auctionId}`;
  }
}
