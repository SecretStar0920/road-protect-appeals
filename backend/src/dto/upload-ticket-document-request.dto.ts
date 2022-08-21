import { ApiModelProperty } from '@nestjs/swagger';
import { IsBase64, IsString, IsNumber } from 'class-validator';

export class UploadTicketDocumentRequestDTO {
    @ApiModelProperty()
    @IsBase64()
    public ticketDocumentBase64: string;

    @ApiModelProperty()
    @IsString()
    public ticketDocumentMimeType: string;

    @ApiModelProperty()
    @IsString()
    public documentDescription: string;

    @ApiModelProperty()
    @IsNumber()
    public documentTypeCode: number;
}
