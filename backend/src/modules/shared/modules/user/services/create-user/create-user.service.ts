import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from '@logger';
import { User, USER_CONSTRAINTS } from '@database/entities/user.entity';
import { LogChannel } from '../../../../../../config/logs';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Injectable()
export class CreateUserService {
    constructor(private logger: LoggerService) {}

    async create(dto: CreateUserDto): Promise<User> {
        const fnc = this.create.name;
        this.logger.debug(LogChannel.USER, `Creating local user`, fnc, dto);
        const user = User.create(dto);

        try {
            await user.save();
            return user;
        } catch (e) {
            this.logger.error(LogChannel.USER, `Failed to create user: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            if (e.constraint && e.constraint === USER_CONSTRAINTS.mobile.constraint) {
                throw new BadRequestException(USER_CONSTRAINTS.mobile.description);
            } else {
                throw new InternalServerErrorException('Failed to create user.');
            }
        }
    }
}
