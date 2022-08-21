import { AddUserRequest } from '../apis/ZA/api';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddUserRequestDTO extends AddUserRequest {
    @ApiModelProperty({ example: 'Sample' })
    @IsString()
    public firstName: string;

    @ApiModelProperty({ example: 'Sample' })
    @IsString()
    public lastName: string;

    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    public mobileNumber: string;

    @ApiModelProperty({ example: 'test@test.com' })
    @IsString()
    public email: string;

    @ApiModelProperty({ example: 'Sample' })
    @IsString()
    public address: string;

    @ApiModelProperty({ example: 'Sample' })
    @IsString()
    public city: string;

    @ApiModelProperty({ example: '987654324' })
    @IsString()
    public israelIdNumber: string;
}
