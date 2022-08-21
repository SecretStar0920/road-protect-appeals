import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { Appeal } from '@database/entities/appeal.entity';

@Injectable()
export class GetAppealService {
    constructor(private logger: LoggerService) {}

    async getAllByCitationNo(citationNo: string): Promise<Appeal[] | undefined> {
        return Appeal.createQueryBuilder('appeal')
            .innerJoin('appeal.ticket', 'ticket')
            .where('ticket.citationNo = :citationNo', { citationNo })
            .andWhere('appeal.deletedAt is null')
            .getMany();
    }

    async getAllByRoadProtectId(id: number): Promise<Appeal[] | undefined> {
        return Appeal.createQueryBuilder('appeal')
            .where("appeal.details->>'roadProtectZAId' = :id", { id })
            .andWhere('appeal."deletedAt" is null')
            .innerJoinAndSelect('appeal.ticket', 'ticket')
            .innerJoinAndSelect('ticket.user', 'user')
            .getMany();
    }
}
