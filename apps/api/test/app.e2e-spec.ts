import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * Requires a real Postgres + Redis reachable via DATABASE_URL / REDIS_URL
 * (docker-compose up, or CI's service containers) and a generated Prisma
 * client (`npx prisma migrate dev`). Not run inside the sandbox this was
 * built in — see README §2 — but wired up and ready to run in yours.
 */
describe('Onbid backend (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', { exclude: ['health'] });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health reports Postgres and Redis both up', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.info.postgres.status).toBe('up');
    expect(res.body.info.redis.status).toBe('up');
  });

  it('register -> me works end to end with a real access token', async () => {
    const email = `e2e-${Date.now()}@example.com`;

    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'password1',
        fullName: 'E2E Test User',
        dateOfBirth: '2000-01-01',
      })
      .expect(201);

    const { accessToken } = registerRes.body.tokens;
    expect(accessToken).toBeDefined();

    const meRes = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(meRes.body.email).toBe(email);
    expect(meRes.body.roles).toEqual(expect.arrayContaining(['BUYER', 'SELLER']));
  });

  it('rejects protected routes with no token', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });
});
