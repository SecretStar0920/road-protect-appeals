import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddLeadTicketRequestDTO {
    @ApiModelProperty({ example: 'Sample' })
    @IsString()
    public firstName: string;

    @ApiModelProperty({ example: 'Lead' })
    @IsString()
    public lastName: string;

    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    public mobile: string;
}
