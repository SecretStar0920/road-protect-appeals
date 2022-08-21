import { LoggerService } from '@logger';
import { Body, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { LogChannel } from '../../../config/logs';
import { GenerateTicketRequestDTO } from '../../../dto/generate-deal-request.dto';
import { PayByCouponDTO } from '../../../dto/pay-by-coupon.dto';
import { PaymentFailedRequest } from '../../../dto/payment-failed-request.dto';
import { PaymentSuccessRequest } from '../../../dto/payment-success-request.dto';
import { MyController } from '../../../helpers/decorators';
import { FailedPaymentService } from '../services/failed-payment.service';
import { PayByCouponService } from '../services/pay-by-coupon.service';
import { PaymentService } from '../services/payment.service';
import { SuccessfulPaymentService } from '../services/successful-payment.service';

@MyController('payment', 'Payment')
export default class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly payByCouponService: PayByCouponService,
        private readonly successfulPaymentService: SuccessfulPaymentService,
        private readonly failedPaymentService: FailedPaymentService,
        private logger: LoggerService,
    ) {}

    @Post('/')
    public async generateDeal(@Body() generateDealRequest: GenerateTicketRequestDTO, @Res() response: Response) {
        const { email } = generateDealRequest;
        const result = await this.paymentService.doDeal(email);
        try {
            const url = result.split('<mpiHostedPageUrl>')[1].split('</mpiHostedPageUrl>')[0];
            return response.status(HttpStatus.OK).send({ url });
        } catch (e) {
            this.logger.error(LogChannel.PAYMENT, 'Failed to extract url', this.generateDeal.name, e);
            return response.status(HttpStatus.BAD_REQUEST).send({ error: response });
        }
    }

    @Post('coupon')
    public async payByCoupon(@Body() dto: PayByCouponDTO, @Req() request: Request): Promise<boolean> {
        return await this.payByCouponService.pay(dto, request);
    }

    @Get('/success')
    public async paymentSuccess(@Res() response: Response, @Query() query: any) {
        const successPage = this.successfulPaymentService.handle(query);
        return response.status(HttpStatus.OK).send(successPage);
    }

    @Get('/error')
    public async paymentError(@Res() response: Response, @Query() query: any) {
        const errorPage = this.failedPaymentService.handle(query);
        return response.status(HttpStatus.OK).send(errorPage);
    }
}
