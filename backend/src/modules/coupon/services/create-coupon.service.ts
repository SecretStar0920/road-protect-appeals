import config from '@config';
import { Coupon, COUPON_CONSTRAINTS } from '@database/entities/coupon.entity';
import { LoggerService } from '@logger';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogChannel } from '../../../config/logs';
import { CouponDto } from '../dtos/coupon.dto';
import { GenerateCouponCodeService } from './generate-coupon-code.service';
import moment = require('moment');

@Injectable()
export class CreateCouponService {
    constructor(
        private readonly logger: LoggerService,
        private readonly generateCouponService: GenerateCouponCodeService,
    ) {}

    async create(dto: CouponDto): Promise<Coupon[]> {
        const fnc = this.create.name;
        const count = dto.count ? dto.count : 1;
        this.logger.debug(LogChannel.COUPON, `Received request to generate ${count} new coupon(s)`, fnc, dto);
        try {
            const generatedCodes = this.generateCouponService.generate(count);

            // Ensure that start date is correct
            const startDate = dto.startDate ? dto.startDate : moment();

            // Ensure that expiry date is correct
            const expiryConfig = config.coupon.defaultExpiry;
            const expiryDate = dto.expiryDate
                ? dto.expiryDate
                : moment().add(expiryConfig.period, expiryConfig.units());

            // Ensure that maximum uses is correct is correct
            const maximumUses = dto.maximumUses ? dto.maximumUses : config.coupon.defaultUses;

            // For every generated coupon, create a new one and return the saved record
            return Promise.all(
                generatedCodes.map(code => {
                    const coupon = Coupon.create(dto);
                    coupon.startDate = startDate;
                    coupon.expiryDate = expiryDate;
                    coupon.maximumUses = maximumUses;

                    // Set the coupon's code to the generated code
                    coupon.code = code;

                    // If a prefix is sent, set prefix on code
                    if (dto.prefix) {
                        coupon.code = `${dto.prefix}-${coupon.code}`;
                        coupon.details = { prefix: dto.prefix };
                    }

                    return coupon.save();
                }),
            ).then(result => {
                this.logger.debug(LogChannel.COUPON, `Generated ${count} new coupon(s)`, fnc, dto);
                return result;
            });
        } catch (e) {
            this.logger.error(LogChannel.COUPON, `Failed to create ${count} coupon(s)`, fnc, {
                dto,
                stack: e.stack,
                error: e,
            });
            if (e.constraint && e.constraint === COUPON_CONSTRAINTS.code.constraint) {
                throw new BadRequestException(COUPON_CONSTRAINTS.code.description);
            } else {
                throw new InternalServerErrorException('Failed to create coupon.');
            }
        }
    }
}
