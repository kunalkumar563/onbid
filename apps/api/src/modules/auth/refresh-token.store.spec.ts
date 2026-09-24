import { ConfigService } from '@nestjs/config';
import { RefreshTokenStore } from './refresh-token.store';

describe('RefreshTokenStore', () => {
  let store: RefreshTokenStore;
  let redis: any;

  beforeEach(() => {
    const multiChain: any = {
      set: jest.fn().mockReturnThis(),
      sadd: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      srem: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };
    redis = {
      multi: jest.fn().mockReturnValue(multiChain),
      get: jest.fn(),
      smembers: jest.fn(),
    };
    const config = { get: jest.fn().mockReturnValue(30) } as unknown as ConfigService;
    store = new RefreshTokenStore(redis, config);
  });

  it('issues a token and stores its hash, not the raw value', async () => {
    const token = await store.issue('user-1');
    expect(token).toHaveLength(128); // 64 bytes hex-encoded

    const multi = redis.multi.mock.results[0].value;
    const [key, storedValue] = multi.set.mock.calls[0];
    expect(key).not.toContain(token); // key is a hash of the token, not the token itself
    expect(storedValue).toBe('user-1');
  });

  it('verify() looks up by the hash of the given token', async () => {
    redis.get.mockResolvedValue('user-1');
    const userId = await store.verify('some-raw-token');
    expect(userId).toBe('user-1');
    expect(redis.get).toHaveBeenCalledWith(expect.stringMatching(/^refresh:[a-f0-9]{64}$/));
  });

  it('rotate() revokes the old token before issuing a new one', async () => {
    const revokeSpy = jest.spyOn(store, 'revoke');
    const issueSpy = jest.spyOn(store, 'issue');

    await store.rotate('old-token', 'user-1');

    expect(revokeSpy).toHaveBeenCalledWith('old-token', 'user-1');
    expect(issueSpy).toHaveBeenCalledWith('user-1');
  });

  it('revokeAllForUser() is a no-op when there are no active sessions', async () => {
    redis.smembers.mockResolvedValue([]);
    await store.revokeAllForUser('user-1');
    expect(redis.multi).not.toHaveBeenCalled();
  });
});
