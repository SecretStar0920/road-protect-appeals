import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { Municipality } from '@database/entities/municipality.entity';

@Injectable()
export class GetMunicipalityService {
    constructor(private logger: LoggerService) {}

    async getMunicipalityByCityCode(cityCode: number): Promise<Municipality | undefined> {
        return Municipality.createQueryBuilder('municipality')
            .where('municipality."cityCode" = :cityCode', { cityCode })
            .getOne();
    }

    async getMunicipalityByCourthouseId(courthouseId: number): Promise<Municipality | undefined> {
        return Municipality.createQueryBuilder('municipality')
            .where(`municipality."courthouseRP"->>'id' like  :courthouseId`, { courthouseId })
            .getOne();
    }
}
