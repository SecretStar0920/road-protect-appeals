import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsEmail } from 'class-validator';
import { ReadStream } from 'fs';

export class MailAttachment {}

export class PlainTextAttachment extends MailAttachment {
    public filename: string;
    public content: string | Buffer | ReadStream;
    public contentType: string = 'text/plain';
}

export class PathAttachment extends MailAttachment {
    public path: string;
}

export class Base64Attachment extends MailAttachment {
    public filename: string;
    public content: string;
    public encoding: string = 'base64';
}

export class MailRequestModel {
    @ApiModelProperty()
    @IsEmail()
    @IsOptional()
    public from: string | undefined;

    @ApiModelProperty()
    @IsArray()
    public to: string[];

    @ApiModelProperty()
    @IsString()
    public subject: string;

    @ApiModelProperty()
    @IsString()
    public htmlBody: string;

    @ApiModelProperty()
    @IsArray()
    @IsOptional()
    public attachments: MailAttachment[] = [];
}
