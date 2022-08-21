import { ApiModelProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class PayByCouponDTO {
    @ApiModelProperty({ example: 'dTj36y8H' })
    @IsString()
    coupon: string;

    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    mobileNumber: string;

    @ApiModelProperty({ example: '1' })
    @IsInt()
    @Transform(value => (Number.isNaN(value) ? value : +value))
    ticketId: number;
}
