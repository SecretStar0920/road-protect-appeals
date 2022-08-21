import { Transform } from 'class-transformer';
import { GetAuthorizationTokenRequest } from '../apis/ZA/api';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNumberString, MinLength } from 'class-validator';

export class GetAuthorizationTokenRequestDto extends GetAuthorizationTokenRequest {
    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    @MinLength(1)
    @Transform(value => (value ? value.trim() : value))
    public username: string;

    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    @MinLength(1)
    @Transform(value => (value ? value.trim() : value))
    public password: string;

    @ApiModelProperty()
    @IsNumberString()
    @MinLength(1)
    @Transform(value => (value ? value.trim() : value))
    public otpCode: string;
}
