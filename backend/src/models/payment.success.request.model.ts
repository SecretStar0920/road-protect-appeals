import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class PaymentSuccssRequestModel {
    @ApiModelProperty()
    @IsString()
    public payme_status: string;

    @ApiModelProperty()
    @IsString()
    public payme_signature: string;

    @ApiModelProperty()
    @IsString()
    public payme_sale_id: string;

    @ApiModelProperty()
    @IsString()
    public payme_transaction_id: string;

    @ApiModelProperty()
    @IsString()
    public currency: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    public transaction_id: string | null;

    @ApiModelProperty()
    @IsNumber()
    @Transform(v => Number(v))
    public is_token_sale: number;

    @ApiModelProperty()
    @IsNumber()
    @Transform(v => Number(v))
    public is_foreign_card: number;
}
