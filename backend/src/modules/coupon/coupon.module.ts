import { Module } from '@nestjs/common';
import { FaxService } from '../../services/fax.service';
import { PostmarkService } from '../../services/postmark.service';
import { ZaService } from '../../services/za/za.service';
import { CouponController } from './controllers/coupon.controller';
import { CreateCouponService } from './services/create-coupon.service';
import { LoggerService } from '@logger';
import { GenerateCouponCodeService } from './services/generate-coupon-code.service';
import { UpdateCouponService } from './services/update-coupon.service';
import { GetCouponService } from './services/get-coupon.service';
import { UpdatePaymentsService } from '../payment/services/update-payments.service';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [CouponController],
    providers: [
        CreateCouponService,
        LoggerService,
        GenerateCouponCodeService,
        UpdateCouponService,
        GetCouponService,
        UpdatePaymentsService,
        ZaService,
        FaxService,
        PostmarkService,
    ],
})
export class CouponModule {}
