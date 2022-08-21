import { LoggerService } from '@logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateTicketRequest } from '../../../apis/ZA/model/update-ticket-request';
import { LogChannel } from '../../../config/logs';
import { CreateCouponPaymentDto } from '../dtos/create-coupon-payment.dto';
import { CouponPayment, CouponPaymentStatus } from '@database/entities/coupon-payment.entity';
import { GetTicketService } from '../../shared/modules/tickets/ticket/services/get-ticket.service';
import { GetAppealService } from '../../shared/modules/tickets/appeal/services/get-appeal.service';
import { Appeal } from '@database/entities/appeal.entity';
import { GetCouponService } from '../../coupon/services/get-coupon.service';
import { CreateCreditCardPaymentDto } from '../dtos/create-credit-card-payment.dto';
import { CreditCardPayment, CreditCardPaymentStatus } from '@database/entities/credit-card-payment.entity';
import { Coupon } from '@database/entities/coupon.entity';
import { PaymentFailedRequest } from '../../../dto/payment-failed-request.dto';
import { UpdateUserLogsService } from '../../shared/modules/user/services/user-logs/update-user-logs.service';
import config from '@config';

@Injectable()
export class UpdatePaymentsService {
    constructor(
        private logger: LoggerService,
        private readonly getTicketService: GetTicketService,
        private readonly getAppealService: GetAppealService,
        private readonly getCouponService: GetCouponService,
        private readonly userLogsService: UpdateUserLogsService,
    ) {}

    private async createCouponPayment(dto: CreateCouponPaymentDto) {
        const fnc = this.createCouponPayment.name;
        this.logger.debug(LogChannel.PAYMENT, `Creating local coupon payment`, fnc);
        const couponPayment = CouponPayment.create(dto);

        try {
            await couponPayment.save();
            this.logger.debug(LogChannel.PAYMENT, `Successfully created a local coupon payment`, fnc);
            return couponPayment;
        } catch (error) {
            this.logger.error(LogChannel.PAYMENT, `Failed to create coupon payment: ${error.message}`, fnc, {
                dto,
                error,
            });
            throw new InternalServerErrorException('Failed to create coupon payment.');
        }
    }

    private async createCreditCardPayment(dto: CreateCreditCardPaymentDto) {
        const fnc = this.createCreditCardPayment.name;
        this.logger.debug(LogChannel.PAYMENT, `Creating local credit-card payment`, fnc);
        const creditCardPayment = CreditCardPayment.create(dto);

        try {
            await creditCardPayment.save();
            this.logger.debug(LogChannel.PAYMENT, `Successfully created a local credit-card payment`, fnc);
            return creditCardPayment;
        } catch (error) {
            this.logger.error(LogChannel.PAYMENT, `Failed to create credit-card payment: ${error.message}`, fnc, {
                dto,
                error,
            });
            throw new InternalServerErrorException('Failed to create credit-card payment.');
        }
    }

    async successfulPayment(updateRequest: Partial<UpdateTicketRequest>) {
        const fnc = this.successfulPayment.name;
        this.logger.debug(LogChannel.PAYMENT, `Updating local database for a successful payment`, fnc, updateRequest);

        if (!updateRequest.id || !updateRequest.paymentRefNumber) {
            this.logger.debug(LogChannel.PAYMENT, `No roadProtectZAId or paymentRefNumber given`, fnc, updateRequest);
            throw new InternalServerErrorException('No roadProtectZAId or paymentRefNumber given');
        }

        const localTicket = await this.getTicketService.getByRoadProtectId(+updateRequest.id);
        if (!localTicket) {
            this.logger.debug(
                LogChannel.PAYMENT,
                `No local ticket found for roadProtectZAId [${updateRequest.id}]`,
                fnc,
            );
            throw new InternalServerErrorException('No local ticket found for id given');
        }

        const localAppeals = await this.getAppealService.getAllByRoadProtectId(+updateRequest.id);
        if (!localAppeals || localAppeals.length > 1) {
            // At this point in time, the system can only cope with one appeal per ticket due to the dependency on the infrasonic system
            this.logger.debug(
                LogChannel.PAYMENT,
                `No local appeal or multiple appeals for roadProtectZAId [${updateRequest.id}]`,
                fnc,
            );
            throw new InternalServerErrorException('No local appeal or multiple appeals for id given');
        }
        const localAppeal = localAppeals[0];

        if (updateRequest.paymentRefNumber.startsWith('COUPON_')) {
            this.logger.debug(LogChannel.PAYMENT, `Coupon payment made`, fnc, updateRequest);
            return this.successfulCouponPayment(
                // +localTicket.violation.amount,
                +config.appealCost.amountInShekels,
                updateRequest.paymentRefNumber,
                localAppeal,
            );
        }
        this.logger.debug(LogChannel.PAYMENT, `Credit-card payment made`, fnc, updateRequest);
        return await this.successfulCreditCardPayment(
            // +localTicket.violation.amount,
            +config.appealCost.amountInShekels,
            updateRequest.paymentRefNumber,
            localAppeal,
        );
    }

    private async successfulCouponPayment(amount: number, paymentRefNumber: string, appeal: Appeal) {
        const fnc = this.successfulCouponPayment.name;
        const refNumber = paymentRefNumber.split('_');

        if (refNumber[2] != String(appeal.details.roadProtectZAId)) {
            this.logger.debug(
                LogChannel.PAYMENT,
                `Local appeal does not match payment reference [${paymentRefNumber}]`,
                fnc,
                { refNumber, Appeal },
            );
            throw new InternalServerErrorException('Local appeal does not match payment reference');
        }

        const coupon = await this.getCouponService.getByCouponCode(refNumber[1]);
        if (!coupon) {
            this.logger.debug(LogChannel.PAYMENT, `No local coupon found for payment ref [${paymentRefNumber}]`, fnc, {
                refNumber,
                coupon,
            });
            throw new InternalServerErrorException('No local coupon found for payment ref');
        }
        const dto: CreateCouponPaymentDto = {
            amount,
            details: { paymentRefNumber },
            appeal,
            status: CouponPaymentStatus.SUCCESS,
            coupon,
        };

        await this.userLogsService.couponPaymentSuccess(+appeal.details.roadProtectZAId, dto);

        return await this.createCouponPayment(dto);
    }

    async failedCouponPayment(coupon: Coupon, roadProtectZAId: number, details?: any) {
        const fnc = this.failedCouponPayment.name;
        this.logger.debug(LogChannel.PAYMENT, `Recording local failed coupon payment made`, fnc);

        const dto: CreateCouponPaymentDto = {
            status: CouponPaymentStatus.FAILED,
            coupon,
        };

        if (details) {
            dto.details = details;
        }

        const localAppeals = await this.getAppealService.getAllByRoadProtectId(roadProtectZAId);
        if (!localAppeals || localAppeals.length > 1) {
            // At this point in time, the system can only cope with one appeal per ticket due to the dependency on the infrasonic system
            this.logger.error(LogChannel.APPEAL, `Could not find a local appeal or multiple appeals`, fnc);
            throw new InternalServerErrorException('Failed to record local coupon payment.');
        }
        const appeal = localAppeals[0];

        if (appeal) {
            dto.appeal = appeal;
            await this.userLogsService.couponPaymentFail(+appeal.details.roadProtectZAId, details);
        } else {
            this.logger.error(LogChannel.APPEAL, `Could not find a local appeal`, fnc);
        }

        return await this.createCouponPayment(dto);
    }

    private async successfulCreditCardPayment(amount: number, paymentRefNumber: string, appeal: Appeal) {
        const fnc = this.successfulCreditCardPayment.name;
        const dto: CreateCreditCardPaymentDto = {
            amount,
            details: paymentRefNumber,
            appeal,
            status: CreditCardPaymentStatus.SUCCESS,
        };

        await this.userLogsService.creditCardPaymentSuccess(+appeal.details.roadProtectZAId, dto);

        return await this.createCreditCardPayment(dto);
    }

    async failedCreditCardPayment(details: PaymentFailedRequest) {
        const fnc = this.failedCreditCardPayment.name;
        const dto: CreateCreditCardPaymentDto = {
            details,
            status: CreditCardPaymentStatus.FAILED,
        };
        return await this.createCreditCardPayment(dto);
    }
}
