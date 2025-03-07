import { connectRedis, redisClient } from './redis-client';

export async function setCache(key: string, value: any, ttl: number) {
  await connectRedis();
  await redisClient.setEx(key, ttl, JSON.stringify(value));
}

export async function getCache<T>(key: string): Promise<T | null> {
  await connectRedis();
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

export async function deleteCache(key: string) {
  await connectRedis();
  await redisClient.del(key);
}
