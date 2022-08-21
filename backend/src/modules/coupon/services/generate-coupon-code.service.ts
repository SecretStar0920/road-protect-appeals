import config from '@config';
import { Injectable } from '@nestjs/common';
import * as vc from 'voucher-code-generator';

@Injectable()
export class GenerateCouponCodeService {
    generate(count: number = 1): string[] {
        return vc.generate({
            length: config.coupon.defaultLength,
            count,
        });
    }
}
