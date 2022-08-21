import { IsDefined, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
    @IsPhoneNumber('ZA')
    mobile: string;

    @IsDefined()
    @IsString()
    password: string;
}
