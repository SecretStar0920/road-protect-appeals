import { CouponLog, CouponLogDetails, CouponLogType } from '@database/entities/coupon-log.entity';
import { Coupon } from '@database/entities/coupon.entity';
import { COUPON_LOG_MAP } from '@database/entities/coupon/coupon-log.map';
import { User } from '@database/entities/user.entity';
import { LoggerService } from '@logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { getConnection } from 'typeorm';
import { LogChannel } from '../../../config/logs';
import { PayByCouponDTO } from '../../../dto/pay-by-coupon.dto';
import { TicketStatus } from '../../../enums/ticket-status.enum';
import { ZaService } from '../../../services/za/za.service';
import moment from 'moment';
import { GetUserService } from '../../shared/modules/user/services/get-user/get-user.service';
import { UpdatePaymentsService } from './update-payments.service';

@Injectable()
export class PayByCouponService {
    constructor(
        private logger: LoggerService,
        private getUserService: GetUserService,
        private updatePaymentsService: UpdatePaymentsService,
        private zaService: ZaService,
    ) {}

    async pay(dto: PayByCouponDTO, request: Request): Promise<boolean> {
        const fnc = this.pay.name;
        const couponCode = dto.coupon;
        this.logger.debug(
            LogChannel.PAYMENT,
            `Received request to make payment with coupon code ${couponCode}`,
            fnc,
            dto,
        );

        // Find user
        const user = await this.getUserService.getByMobile(dto.mobileNumber);

        if (!user) {
            this.logger.error(
                LogChannel.PAYMENT,
                `Failed to find user with mobile number ${dto.mobileNumber}`,
                fnc,
                dto,
            );
            throw new BadRequestException('הקופון אינו פעיל');
        }
        // Find and validate coupon
        const coupon = await this.findAndValidateCoupon(couponCode, user, dto.ticketId);
        const details = {
            roadProtectZATicketId: dto.ticketId,
        };
        // If valid coupon, create successful coupon log
        const successCouponLog = CouponLog.create({
            ...COUPON_LOG_MAP.success,
            coupon,
            user,
            details,
        });

        try {
            // The coupon log should only save as successful if the ticket status update is also successful
            await getConnection().transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(successCouponLog);
                const paymentRef = `COUPON_${coupon.code}_${dto.ticketId}`;
                const updateTicketStatusResponse = await this.zaService.updateTicketStatus(
                    user.roadProtectZAId,
                    `${dto.ticketId}`,
                    TicketStatus.PAID_CREDIT_CARD,
                    request,
                    paymentRef,
                );
                if (updateTicketStatusResponse instanceof Error) {
                    throw updateTicketStatusResponse;
                }
            });
        } catch (e) {
            this.logger.error(LogChannel.ZA, e.message, fnc, {
                ticketId: dto.ticketId,
                updateTicketStatusRequest: {
                    customerId: user.roadProtectZAId,
                    status: TicketStatus.PAID_CREDIT_CARD,
                },
                stack: e.stack,
            });
            await this.updatePaymentsService.failedCouponPayment(coupon, dto.ticketId, e);
            await this.logCouponError(coupon, user, { message: e.message });
            throw new BadRequestException(e.message);
        }
        // Send email

        return true;
    }

    private async findAndValidateCoupon(code: string, user: User, ticketId: number): Promise<Coupon> {
        const fnc = this.findAndValidateCoupon.name;
        const coupon = await Coupon.createQueryBuilder('coupon')
            .leftJoinAndSelect('coupon.couponLogs', 'couponLogs', 'couponLogs.type = :logType', {
                logType: CouponLogType.Success,
            })
            .andWhere('coupon.code = :code', { code })
            .andWhere('coupon.active = :active', { active: true })
            .andWhere('coupon.deletedAt IS NULL')
            .getOne();

        if (!coupon) {
            this.logger.error(LogChannel.PAYMENT, `No active coupon found with coupon code ${code}`, fnc);
            throw new BadRequestException('הקופון אינו פעיל');
        }

        const uses = coupon.couponLogs.length;
        if (uses >= coupon.maximumUses) {
            const message = `Maximum uses reached with coupon code ${code}`;
            this.logger.error(LogChannel.PAYMENT, message, fnc, coupon);
            await this.logCouponError(coupon, user, { message });
            await this.updatePaymentsService.failedCouponPayment(coupon, ticketId, message);
            throw new BadRequestException('הקופון אינו פעיל');
        }

        // Check now is between start and expiry date
        // Start time and expiry time are NOT included
        const dateValid = moment().isBetween(coupon.startDate, coupon.expiryDate);
        if (!dateValid) {
            const message = `Coupon with coupon code ${code} is being used outside of start and expiry dates`;
            this.logger.error(LogChannel.PAYMENT, message, fnc, coupon);
            await this.logCouponError(coupon, user, { message });
            await this.updatePaymentsService.failedCouponPayment(coupon, ticketId, message);
            throw new BadRequestException('הקופון אינו פעיל');
        }

        return coupon;
    }

    async logCouponError(coupon: Coupon, user: User, details: CouponLogDetails): Promise<CouponLog> {
        return CouponLog.create({
            ...COUPON_LOG_MAP.error,
            coupon,
            user,
            details,
        }).save();
    }
}
