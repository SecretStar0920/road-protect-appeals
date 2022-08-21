import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class GenerateApiUserTokenDto {
    @Transform(value => +value)
    @IsInt()
    userId: number;

    @IsString()
    mobile: string;
}
