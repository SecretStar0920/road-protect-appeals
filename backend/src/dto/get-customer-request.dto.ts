import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetCustomerRequestDTO {
    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    public username: string;
}
