import { deleteCache, getCache, setCache } from '../cache-service';
import { connectRedis, redisClient } from '../redis-client';

describe('Cache Service', () => {
  beforeAll(async () => {
    await connectRedis();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  test('should set and get a value', async () => {
    const key = 'test-key';
    const value = { message: 'Hello' };

    await setCache(key, value, 60); // TTL 60 seconds
    const cachedValue = await getCache<typeof value>(key);
    expect(cachedValue).toEqual(value);
  });

  test('should delete a value', async () => {
    const key = 'test-delete';
    const value = { data: 'to-delete' };

    await setCache(key, value, 60);
    await deleteCache(key);
    const cachedValue = await getCache(key);
    expect(cachedValue).toBeNull();
  });
});
