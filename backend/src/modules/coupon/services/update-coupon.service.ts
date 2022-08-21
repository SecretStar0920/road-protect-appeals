import { Coupon } from '@database/entities/coupon.entity';
import { LoggerService } from '@logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { merge } from 'lodash';
import { LogChannel } from '../../../config/logs';
import { CouponDto } from '../dtos/coupon.dto';
import { GetCouponService } from './get-coupon.service';

@Injectable()
export class UpdateCouponService {
    constructor(private readonly logger: LoggerService, private readonly getCouponService: GetCouponService) {}

    async update(couponCode: string, dto: CouponDto): Promise<Coupon> {
        const fnc = this.update.name;
        try {
            this.logger.debug(LogChannel.COUPON, `Received request to update coupon with code ${couponCode}`, fnc, dto);

            let coupon = await this.getCouponService.getByCouponCode(couponCode);
            coupon = merge(coupon, dto);

            this.logger.debug(LogChannel.COUPON, `Updating coupon with code ${couponCode}`, fnc, coupon);
            return coupon.save();
        } catch (e) {
            this.logger.error(LogChannel.COUPON, `Failed to update coupon`, fnc, e);
            throw new InternalServerErrorException('Failed to update coupon');
        }
    }

    async activate(couponCode: string): Promise<Coupon> {
        const fnc = this.activate.name;
        try {
            this.logger.debug(LogChannel.COUPON, `Received request to activate coupon with code ${couponCode}`, fnc);

            const coupon = await this.getCouponService.getByCouponCode(couponCode);
            coupon.active = true;

            this.logger.debug(LogChannel.COUPON, `Activating coupon with code ${couponCode}`, fnc, coupon);
            return coupon.save();
        } catch (e) {
            this.logger.error(LogChannel.COUPON, `Failed to activate coupon`, fnc, e);
            throw new InternalServerErrorException('Failed to activate coupon');
        }
    }

    async deactivate(couponCode: string): Promise<Coupon> {
        const fnc = this.deactivate.name;
        try {
            this.logger.debug(LogChannel.COUPON, `Received request to deactivate coupon with code ${couponCode}`, fnc);

            const coupon = await this.getCouponService.getByCouponCode(couponCode);
            coupon.active = false;

            this.logger.debug(LogChannel.COUPON, `Deactivating coupon with code ${couponCode}`, fnc, coupon);
            return coupon.save();
        } catch (e) {
            this.logger.error(LogChannel.COUPON, `Failed to deactivate coupon`, fnc, e);
            throw new InternalServerErrorException('Failed to deactivate coupon');
        }
    }
}
