import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    mobileNumber?: string;

    @IsOptional()
    @IsNumber()
    public roadProtectZAId?: number;

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
