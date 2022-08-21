import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import bluebird from 'bluebird';
import redis, { RedisClient } from 'redis';
import config from '../config';
import { LogChannel } from '../config/logs';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

@Injectable()
export class RedisService {
    private client: RedisClient;
    private static service_down;
    private REDIS_EVENTS = { CONNECT: 'connect', ERROR: 'error' };

    constructor(private readonly logger: LoggerService) {
        if (config.redis.disable) {
            return;
        }
        this.initializeConnection();
    }

    initializeConnection() {
        this.client = redis.createClient(config.redis.port, config.redis.host);
        if (config.redis.pass) {
            this.client.auth(config.redis.pass, () => {
                this.logger.debug(LogChannel.REDIS, 'Redis service - set auth', this.initializeConnection.name);
            });
        }

        this.client.on(this.REDIS_EVENTS.CONNECT, () => {
            RedisService.service_down = false;
            this.logger.debug(
                LogChannel.REDIS,
                `Redis client connected on ${config.redis.host}:${config.redis.port}`,
                this.initializeConnection.name,
            );
        });
        this.client.on(this.REDIS_EVENTS.ERROR, err => {
            RedisService.service_down = true;
            this.logger.error(LogChannel.REDIS, 'Redis service go down', this.initializeConnection.name, err);
        });
    }

    async getKey(key: string): Promise<any | null> {
        if (RedisService.service_down) {
            return null;
        }

        try {
            const result = await (this.client as any).getAsync(key).catch(err => ({ error: true, errObj: err }));
            if (result && result.error) {
                this.logger.error(LogChannel.REDIS, `Error retrieving key ${key}`, this.getKey.name, result.errObj);
                return null;
            }
            let json = null;
            try {
                json = JSON.parse(result);
            } catch (e) {
                this.logger.error(LogChannel.REDIS, `Failed to parse object`, this.getKey.name, {
                    json,
                    e,
                });
            }
            return json;
        } catch (e) {
            this.logger.error(LogChannel.REDIS, `Something failed`, this.getKey.name, e);
        }
        return null;
    }

    async setKey(key: string, data: any, ttlInSecs?: number) {
        if (RedisService.service_down) {
            this.logger.error(LogChannel.REDIS, `The redis server is down!`, this.setKey.name, { key, data });
            return;
        }
        await (this.client as any).setAsync(key, JSON.stringify(data));
        if (ttlInSecs) {
            this.client.expire(key, ttlInSecs);
        }
    }

    async deleteKeys(...keys: string[]) {
        if (RedisService.service_down) {
            return;
        }
        await (this.client as any).delAsync(keys);
        this.logger.debug(LogChannel.REDIS, `Delete keys ${keys.join(',')}`, this.deleteKeys.name);
    }

    async getKeyWithFallback(key: string, fallback: () => Promise<any>): Promise<any> {
        let data = await this.getKey(key);
        if (!data) {
            this.logger.debug(LogChannel.REDIS, `Get key from fallback ${key}`, this.getKeyWithFallback.name);
            data = await fallback();
            this.setKey(key, data);
        } else {
            this.logger.debug(LogChannel.REDIS, `Get key from cache ${key}`, this.getKeyWithFallback.name);
        }
        return data;
    }
}
