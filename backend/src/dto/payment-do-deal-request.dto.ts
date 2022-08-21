import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumberString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentDoDealRequestDTO {
    @ApiModelProperty()
    @IsNumberString()
    public cardNumber: string;

    @ApiModelProperty()
    @IsNumberString()
    public cvv: string;

    @ApiModelProperty()
    @IsNumberString()
    public expirationMonth: string;

    @ApiModelProperty()
    @IsNumberString()
    public expirationYear: string;

    @ApiModelProperty()
    @IsNumberString()
    public israelIdNumber: string;

    @ApiModelProperty()
    @IsNumber()
    public customerId: number;
}
