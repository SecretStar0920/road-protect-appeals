import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { Ticket } from '@database/entities/ticket.entity';

@Injectable()
export class GetTicketService {
    constructor(private logger: LoggerService) {}

    async getByCitationNo(citationNo: string): Promise<Ticket | undefined> {
        return Ticket.createQueryBuilder('ticket')
            .where('ticket.citationNo = :citationNo', { citationNo })
            .andWhere('appeal.deletedAt is null')
            .getOne();
    }

    async getByRoadProtectId(id: number): Promise<Ticket | undefined> {
        return Ticket.createQueryBuilder('ticket').where(`ticket.details->>'id' like  :id`, { id }).getOne();
    }
}
