import { User } from '@database/entities/user.entity';
import { LoggerService } from '@logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LogChannel } from '../../../config/logs';
import { GetCustomerResponseDTO } from '../../../dto/get-customer-response.dto';
import { ZaService } from '../../../services/za/za.service';

@Injectable()
export class GetCustomerService {
    constructor(private readonly logger: LoggerService, private readonly zaService: ZaService) {}

    async getCustomer(userId: number, req: Request): Promise<GetCustomerResponseDTO> {
        const fnc = this.getCustomer.name;
        this.logger.debug(LogChannel.CUSTOMER, `Retrieving customer for user id ${userId}`, fnc);
        const user = await User.findOne(userId);

        if (!user) {
            this.logger.error(LogChannel.CUSTOMER, 'No user found for given user id', fnc, this.getCustomer.name);
            throw new BadRequestException('No user found');
        }

        const username = user.username;
        const customer = await this.zaService.getCustomer({ username }, req);
        this.logger.debug(LogChannel.CUSTOMER, 'Retrieved customer', fnc, customer);

        return customer;
    }
}
