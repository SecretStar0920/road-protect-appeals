import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SendFaxRequestDTO {
    @ApiModelProperty()
    @IsString()
    faxNumber: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    fileUrl: string;
}
