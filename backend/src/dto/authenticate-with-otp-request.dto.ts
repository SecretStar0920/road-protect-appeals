import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthenticateWithOTPRequestDto {
    @ApiModelProperty()
    @IsString()
    public mobile: string;

    @ApiModelProperty()
    @IsString()
    public firstName: string;
}
