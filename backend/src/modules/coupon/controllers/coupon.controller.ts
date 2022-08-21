import { Coupon } from '@database/entities/coupon.entity';
import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MyController } from '../../../helpers/decorators';
import { SystemAdminGuard } from '../../auth/guards/system-admin.guard';
import { CouponDto } from '../dtos/coupon.dto';
import { CreateCouponService } from '../services/create-coupon.service';
import { UpdateCouponService } from '../services/update-coupon.service';

@MyController('coupon')
@UseGuards(AuthGuard(), SystemAdminGuard)
export class CouponController {
    constructor(
        private readonly createCouponService: CreateCouponService,
        private readonly updateCouponService: UpdateCouponService,
    ) {}

    @Post()
    async generate(@Body() dto: CouponDto): Promise<Coupon[]> {
        return this.createCouponService.create(dto);
    }

    @Patch(':couponCode')
    async update(@Param('couponCode') couponCode: string, @Body() dto: CouponDto): Promise<Coupon> {
        return this.updateCouponService.update(couponCode, dto);
    }

    @Patch(':couponCode/activate')
    async activate(@Param('couponCode') couponCode: string): Promise<Coupon> {
        return this.updateCouponService.activate(couponCode);
    }

    @Patch(':couponCode/deactivate')
    async deactivate(@Param('couponCode') couponCode: string): Promise<Coupon> {
        return this.updateCouponService.deactivate(couponCode);
    }
}
