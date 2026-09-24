import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStore } from './refresh-token.store';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PassportModule,
    NotificationsModule, // EmailService, for password-reset links — see auth.service.ts
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const privateKey = config.get<string>('jwt.accessPrivateKey');
        const publicKey = config.get<string>('jwt.accessPublicKey');
        if (!privateKey || !publicKey) {
          throw new Error(
            'JWT_ACCESS_PRIVATE_KEY / JWT_ACCESS_PUBLIC_KEY are not set. ' +
              'Run: npx ts-node scripts/generate-jwt-keys.ts',
          );
        }
        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: config.get<string>('jwt.accessTtl'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStore],
  // JwtModule is exported alongside AuthService: BiddingGateway needs
  // JwtService directly to verify the token on a WebSocket handshake, which
  // never touches the HTTP guard pipeline JwtStrategy/JwtAuthGuard rely on.
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
