import { User } from '@database/entities/user.entity';

export class LoginResponseDto {
    user: User;
    token: string;
}
