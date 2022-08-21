import { Coupon } from '@database/entities/coupon.entity';
import { LoggerService } from '@logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LogChannel } from '../../../config/logs';

@Injectable()
export class GetCouponService {
    constructor(private readonly logger: LoggerService) {}

    async getByCouponCode(couponCode: string): Promise<Coupon> {
        const fnc = this.getByCouponCode.name;
        this.logger.debug(LogChannel.COUPON, `Request to get coupon with code ${couponCode}`, fnc);
        const coupon = await Coupon.createQueryBuilder('coupon')
            .andWhere('coupon.code = :code', { code: couponCode })
            .getOne();

        if (!coupon) {
            this.logger.error(LogChannel.COUPON, `No coupon found with code ${couponCode}`, fnc);
            throw new BadRequestException(`No coupon found with code ${couponCode}`);
        }

        return coupon;
    }
}
