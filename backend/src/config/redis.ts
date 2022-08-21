import redisClient from 'redis';

export const redis = {
    disable: process.env.DISABLE_REDIS || false,
    host: process.env.REDIS_CACHE_HOST || 'redis',
    pass: '',
    port: parseInt(process.env.REDIS_CACHE_PORT || '6379', 10),
    client: redisClient,
};
