import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Error:', err));

export async function connectRedis() {
  if (!redisClient.isOpen) await redisClient.connect();
}

export { redisClient };
