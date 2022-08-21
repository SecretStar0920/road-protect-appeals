import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class GenerateTicketRequestDTO {
    @ApiModelProperty({ example: 'user@mail.com' })
    @IsEmail()
    public email: string;
}
