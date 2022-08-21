import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ContactUsDto {
    @IsString()
    name: string;

    @IsString()
    mobile: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    message: string;
}
