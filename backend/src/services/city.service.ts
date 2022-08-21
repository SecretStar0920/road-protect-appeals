import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { LogChannel } from '../config/logs';
import { RedisService } from './redis.service';
import { ResourcesLoader } from './resources.loader';

@Injectable()
export class CityService {
    constructor(
        private readonly redisService: RedisService,
        private readonly resourcesLoader: ResourcesLoader,
        private logger: LoggerService,
    ) {}

    public async getCities() {
        const cities = await this.redisService.getKeyWithFallback(
            'cities',
            async () => await this.resourcesLoader.loadCitiesAndStreets('cities'),
        );
        return cities.sort();
    }

    public async getStreetsByCityName(cityName: string): Promise<Array<{ id: number; name: string }> | null> {
        const fnc = this.getStreetsByCityName.name;
        const redisKey = `${cityName}_streets`;
        let res = await this.redisService.getKey(redisKey);
        if (!res) {
            const cities = await this.redisService.getKey('cities');
            if (!cities) {
                this.logger.error(
                    LogChannel.CITY,
                    `The cities key in redis does not exist, we were searching for ${redisKey}.`,
                    fnc,
                );
            }
            res = await this.resourcesLoader.loadCitiesAndStreets(redisKey);
        }
        return res.sort();
    }
}
