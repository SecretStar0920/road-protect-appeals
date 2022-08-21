import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumberString, IsOptional } from 'class-validator';

export class UpdateCustomerProfileRequestDTO {
    // Don't actually want to be able to update the following properties right now
    // @ApiModelProperty()
    // @IsString()
    // public firstName: string;
    //
    // @ApiModelProperty()
    // @IsString()
    // public lastName: string;
    //
    // @ApiModelProperty()
    // @IsString()
    // public mobileNumber: string;

    @ApiModelProperty()
    @IsEmail()
    public email: string;

    @ApiModelProperty()
    @IsString()
    public address: string;

    @ApiModelProperty()
    @IsString()
    public city: string;

    @ApiModelProperty()
    @IsNumberString()
    public israelIdNumber: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    public additionalMobileNumber: string;
}
