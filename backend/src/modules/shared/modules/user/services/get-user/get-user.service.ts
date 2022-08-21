import { User } from '@database/entities/user.entity';
import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserService {
    constructor(private logger: LoggerService) {}

    async getByMobile(mobile: string): Promise<User | undefined> {
        return User.createQueryBuilder('user').where('user.mobileNumber = :mobile', { mobile }).getOne();
    }

    async getByCustomerId(customerId: number): Promise<User | undefined> {
        return User.createQueryBuilder('user').where('user.roadProtectZAId = :customerId', { customerId }).getOne();
    }

    async getUserFromTicket(ticketId: number): Promise<User | undefined> {
        return User.createQueryBuilder('user')
            .innerJoin('user.tickets', 'ticket', 'ticket.ticketId = :ticketId', { ticketId })
            .getOne();
    }

    async getUserFromRoadProtectZAId(id: number): Promise<User | undefined> {
        return User.createQueryBuilder('user')
            .innerJoin('user.tickets', 'ticket', `ticket.details->>'id' like :id`, { id })
            .getOne();
    }
}
