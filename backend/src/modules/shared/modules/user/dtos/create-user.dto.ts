import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    mobileNumber: string;

    @IsNumber()
    public roadProtectZAId: number;

    @IsOptional()
    @IsString()
    public email?: string;

    @IsOptional()
    @IsString()
    public address?: string;

    @IsOptional()
    @IsString()
    public city?: string;

    @IsOptional()
    @IsString()
    public country?: string;

    @IsOptional()
    @IsString()
    public israelIdNumber?: string;
}
