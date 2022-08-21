import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class AddTicketRequestDTO {
    @ApiModelProperty()
    @IsNumberString()
    public customerId: string;

    @IsString()
    @IsOptional()
    partner: string;
}
