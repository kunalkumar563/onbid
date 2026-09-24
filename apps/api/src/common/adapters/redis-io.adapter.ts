import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

/**
 * Tech stack §3: "Socket.io + Redis (adapter + atomic bid writes)". Without
 * this, `server.to(room).emit(...)` in BiddingGateway only reaches sockets
 * connected to the SAME app instance — fine with one instance, silently
 * broken the moment there are two. This makes room broadcasts fan out via
 * Redis Pub/Sub across every instance, which is a separate concern from the
 * Redis Stream used for reconnect replay (that's durable catch-up history;
 * this is just live fan-out, nothing is persisted here).
 */
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?: ReturnType<typeof createAdapter>;

  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const config = this.app.get(ConfigService);
    const redisUrl = config.get<string>('redis.url', 'redis://localhost:6379');

    const pubClient = new Redis(redisUrl);
    const subClient = pubClient.duplicate();

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): unknown {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
