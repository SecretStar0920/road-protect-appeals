import { LoggerService } from '@logger';
import { Module } from '@nestjs/common';
import { FaxService } from '../../services/fax.service';
import { PostmarkService } from '../../services/postmark.service';
import { ZaService } from '../../services/za/za.service';
import { CustomerController } from './controllers/customer.controller';
import { GetCustomerService } from './services/get-customer.service';
import { UpdatePaymentsService } from '../payment/services/update-payments.service';
import { SharedModule } from '../shared/shared.module';
import { GetCouponService } from '../coupon/services/get-coupon.service';

@Module({
    controllers: [CustomerController],
    imports: [SharedModule],
    providers: [
        LoggerService,
        ZaService,
        UpdatePaymentsService,
        GetCouponService,
        FaxService,
        PostmarkService,
        GetCustomerService,
    ],
})
export class CustomerModule {}
