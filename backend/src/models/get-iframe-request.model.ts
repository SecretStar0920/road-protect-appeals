import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetIframeRequestModel {
    @ApiModelProperty()
    @IsString()
    public firstName: string;

    @ApiModelProperty()
    @IsString()
    public lastName: string;

    @ApiModelProperty()
    @IsString()
    public phone: string;

    @ApiModelProperty()
    @IsString()
    public email: string;
}
