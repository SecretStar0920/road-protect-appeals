import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Appeal } from '@database/entities/appeal.entity';
import { CouponPaymentStatus } from '@database/entities/coupon-payment.entity';
import { Coupon } from '@database/entities/coupon.entity';

export class CreateCouponPaymentDto {
    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    details?: any;

    @IsOptional()
    appeal?: Appeal;

    @IsOptional()
    status: CouponPaymentStatus;

    @IsOptional()
    coupon: Coupon;
}
