import { ApiModelProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import moment, { Moment } from 'moment';
import { IsMoment } from '../../shared/validators/moment.validator';

export class CouponDto {
    @ApiModelProperty()
    @IsOptional()
    @Transform(value => +value)
    @IsInt()
    count: number;

    @ApiModelProperty()
    @IsOptional()
    @Transform(value => +value)
    @IsInt()
    maximumUses: number;

    @ApiModelProperty()
    @IsOptional()
    @Transform(value => moment(value))
    @IsMoment()
    expiryDate: Moment;

    @ApiModelProperty()
    @IsOptional()
    @Transform(value => moment(value))
    @IsMoment()
    startDate: Moment;

    @ApiModelProperty()
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiModelProperty()
    @IsOptional()
    @IsString()
    prefix?: string;
}
