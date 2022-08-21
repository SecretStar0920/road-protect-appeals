import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTicketHistoryRequestDTO {
    @ApiModelProperty({ example: 0 })
    @IsString()
    public customerId: string;
}
