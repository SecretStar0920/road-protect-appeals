import config from '@config';
import { User, UserType } from '@database/entities/user.entity';
import { LoggerService } from '@logger';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { LogChannel } from '../../../config/logs';
import { GenerateApiUserTokenDto } from '../controllers/generate-api-user-token.dto';
import { LoginResponseDto } from '../controllers/login-response.dto';
import { LoginDto } from '../controllers/login.dto';

const jwtKeys = ['userId', 'mobileNumber'];

@Injectable()
export class AuthService {
    constructor(private readonly logger: LoggerService, private readonly jwtService: JwtService) {}

    async validateUser(payload: { userId: number; mobileNumber: string }): Promise<User | undefined> {
        return User.findOne({
            where: { userId: payload.userId, mobileNumber: payload.mobileNumber },
        });
    }

    async login(dto: LoginDto): Promise<LoginResponseDto> {
        const fnc = this.login.name;
        this.logger.debug(LogChannel.AUTH, 'Login request', fnc, dto.mobile);

        // Find the user
        const user = await User.createQueryBuilder('user')
            .andWhere('user.mobileNumber = :mobile', { mobile: dto.mobile })
            .getOne();

        if (!user) {
            this.logger.debug(LogChannel.AUTH, 'Bad login request, mobile not found', fnc, dto.mobile);
            throw new ForbiddenException('Incorrect login credentials');
        }

        if (user.type !== UserType.Admin && user.type !== UserType.Developer) {
            this.logger.debug(LogChannel.AUTH, 'User is neither an admin nor a developer', fnc, dto.mobile);
            throw new ForbiddenException('Incorrect login credentials');
        }

        // Select for password
        const password = await user.getPassword();
        if (!password) {
            this.logger.debug(LogChannel.AUTH, 'Bad login password', fnc, dto.mobile);
            throw new ForbiddenException('Incorrect login credentials');
        }
        this.logger.debug(LogChannel.AUTH, 'Successfully found user by mobile', fnc, dto.mobile);

        // Compare the passwords using bcrupt compare
        this.logger.debug(LogChannel.AUTH, 'Comparing passwords', fnc, dto.mobile);
        const validPassword = await bcrypt.compare(dto.password, password);
        if (!validPassword) {
            this.logger.debug(LogChannel.AUTH, 'Bad login password', fnc, dto.mobile);
            throw new ForbiddenException('Incorrect login credentials');
        }
        this.logger.debug(LogChannel.AUTH, 'Successful user login', fnc, dto.mobile);

        // Generate token
        const token = this.jwtService.sign(pick(user, jwtKeys), { expiresIn: config.auth.jwt.expiry });
        this.logger.debug(LogChannel.AUTH, 'Generated token', fnc, dto.mobile);

        // Return their user, token and current account information
        return {
            token,
            user,
        };
    }

    async generateApiUserToken(dto: GenerateApiUserTokenDto): Promise<{ token: string }> {
        const fnc = this.generateApiUserToken.name;
        this.logger.debug(LogChannel.AUTH, 'Request to generate long term api user token', fnc, { dto });
        const user = await User.findOne(dto.userId);

        if (isNil(user)) {
            throw new BadRequestException('Invalid user');
        }

        const token = this.jwtService.sign(pick(user, jwtKeys), { expiresIn: '10 years' });
        this.logger.debug(LogChannel.AUTH, 'Generated token successfully', fnc, { dto });
        return { token };
    }
}
