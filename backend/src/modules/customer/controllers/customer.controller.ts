import { Get, Param, Req } from '@nestjs/common';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { Request } from 'express';
import { GetCustomerResponseDTO } from '../../../dto/get-customer-response.dto';
import { MyController } from '../../../helpers/decorators';
import { GetCustomerService } from '../services/get-customer.service';

@MyController('customer', 'Customer')
export class CustomerController {
    constructor(private readonly getCustomerService: GetCustomerService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get(':userId')
    getCustomer(@Param('userId') userId: string, @Req() req: Request): Promise<GetCustomerResponseDTO> {
        return this.getCustomerService.getCustomer(+userId, req);
    }
}
