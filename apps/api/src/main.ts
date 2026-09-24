import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Consistent structured-ish logging; swap for a proper Logger service (Sentry/Axiom) in Phase 9.
    logger: ['error', 'warn', 'log'],
    bodyParser: false, // we install express.json() manually below to capture rawBody
  });

  // Socket.io + Redis adapter, per tech stack §3 — see redis-io.adapter.ts
  // for why this matters the moment there's more than one app instance.
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Needed so JwtStrategy can read an access/refresh token from a cookie —
  // the frontend was built expecting cookie-based sessions
  // (credentials:"include", no token in response bodies), so auth supports
  // both a Bearer header AND a cookie rather than requiring a frontend
  // rewrite. See auth.controller.ts for where the cookies actually get set.
  app.use(cookieParser());

  // Capture the raw request body bytes alongside the parsed JSON. Needed for
  // verifying HMAC-signed webhooks (KYC provider callbacks now, Razorpay
  // webhooks in Phase 4) — signatures are computed over the exact bytes sent,
  // not a re-serialized copy of the parsed object.
  app.use(
    json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf.toString('utf8');
      },
    }),
  );

  const config = app.get(ConfigService);

  // Frontend is a separate repo/origin — CORS is required, not optional.
  // NOTE: this previously read config.get('CORS_ORIGINS') (the raw env var
  // name) instead of the actual registered config key 'corsOrigins' —
  // meaning the env var was silently never applied, always falling through
  // to reflect-any-origin. Fixed here. Also now required, not optional,
  // for cookies: a browser will not send/accept credentialed cookies
  // against a wildcard origin, only a specific reflected one (which `true`
  // does correctly — see the cors package's docs — but only once this
  // actually reads the right config key).
  const corsOrigins = config.get<string>('corsOrigins', '*');
  app.enableCors({
    origin: corsOrigins === '*' ? true : corsOrigins.split(',').map((o) => o.trim()),
    credentials: true,
  });

  app.setGlobalPrefix('api', {
    exclude: ['health'], // GET /health stays unprefixed for platform health checks (Railway/Render)
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // reject requests with unexpected fields instead of silently dropping them
      transform: true, // turn plain JSON into typed DTO instances (numbers, dates, etc.)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Onbid backend listening on port ${port}`, 'Bootstrap');
}

bootstrap();
