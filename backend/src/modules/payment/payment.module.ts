import { LoggerService } from '@logger';
import { Module } from '@nestjs/common';
import { FaxService } from '../../services/fax.service';
import { PostmarkService } from '../../services/postmark.service';
import { ZaService } from '../../services/za/za.service';
import { CouponModule } from '../coupon/coupon.module';
import PaymentController from './controllers/payment.controller';
import { PayByCouponService } from './services/pay-by-coupon.service';
import { PaymentService } from './services/payment.service';
import { SuccessfulPaymentService } from './services/successful-payment.service';
import { FailedPaymentService } from './services/failed-payment.service';
import { UpdatePaymentsService } from './services/update-payments.service';
import { GetCouponService } from '../coupon/services/get-coupon.service';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [SharedModule, CouponModule],
    controllers: [PaymentController],
    providers: [
        PaymentService,
        PayByCouponService,
        UpdatePaymentsService,
        GetCouponService,
        // TODO: REFACTOR THE BELOW INTO SHARED MODULE
        LoggerService,
        ZaService,
        FaxService,
        PostmarkService,
        SuccessfulPaymentService,
        FailedPaymentService,
    ],
})
export class PaymentModule {}
