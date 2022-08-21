import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { LogChannel } from '../config/logs';
import { RedisService } from './redis.service';
import { ResourcesLoader } from './resources.loader';

@Injectable()
export class CarService {
    constructor(
        private readonly redisService: RedisService,
        private readonly resourcesLoader: ResourcesLoader,
        private logger: LoggerService,
    ) {}

    public async getManufacturers() {
        return await this.redisService.getKeyWithFallback(
            'manufacturers',
            async () => await this.resourcesLoader.loadCarsData('manufacturers'),
        );
    }

    public async getModels(manufacturer: string) {
        const fnc = this.getModels.name;
        const redisKey = `${manufacturer}_models`;
        let res = await this.redisService.getKey(redisKey);
        if (!res) {
            const manufacturers = await this.redisService.getKey('manufacturers');
            if (!manufacturers) {
                this.logger.error(
                    LogChannel.CAR,
                    `The manufacturers key on redis does not exist, the key we were looking for was ${redisKey}.`,
                    fnc,
                );
            }
            res = await this.resourcesLoader.loadCarsData(redisKey);
        }
        return res.sort();
    }
}
