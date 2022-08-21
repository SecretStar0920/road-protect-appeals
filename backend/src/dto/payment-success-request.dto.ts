import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentSuccessRequest {
    @ApiModelProperty()
    @IsUUID()
    public uniqueID: string;

    @ApiModelProperty()
    @IsString()
    public lang: string;

    @ApiModelProperty()
    @IsOptional()
    public authNumber: string;

    @ApiModelProperty()
    @Transform(v => Number(v))
    @IsNumber()
    public cgUid: number;

    @ApiModelProperty()
    @IsString()
    public responseMac: string;

    @ApiModelProperty()
    @Transform(v => Number(v))
    @IsNumber()
    public cardToken: number;

    @ApiModelProperty()
    @Transform(v => Number(v))
    @IsNumber()
    public cardExp: number;

    @ApiModelProperty()
    @IsOptional()
    public personalId: string;

    @ApiModelProperty()
    @IsString()
    public cardMask: string;

    @ApiModelProperty()
    @IsString()
    public txId: string;

    @ApiModelProperty()
    @Transform(v => Number(v))
    @IsNumber()
    public numberOfPayments: number;

    @ApiModelProperty()
    @IsOptional()
    public firstPayment: string;

    @ApiModelProperty()
    @IsOptional()
    public periodicalPayment: string;
}
