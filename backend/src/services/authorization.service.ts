import { LoggerService } from '@logger';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { authenticator } from 'otplib';
import { Twilio } from 'twilio';
import config, { getENV } from '../config';
import { LogChannel } from '../config/logs';
import { GetAuthorizationTokenRequestDto } from '../dto/get-authorization-token-request.dto';
import { GetCustomerResponseDTO } from '../dto/get-customer-response.dto';
import { EnvironmentOptions } from '../helpers/environment';
import { CreateUserDto } from '../modules/shared/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '../modules/shared/modules/user/dtos/update-user.dto';
import { CreateUserService } from '../modules/shared/modules/user/services/create-user/create-user.service';
import { GetUserService } from '../modules/shared/modules/user/services/get-user/get-user.service';
import { UpdateUserService } from '../modules/shared/modules/user/services/update-user/update-user.service';
import { UpdateUserLogsService } from '../modules/shared/modules/user/services/user-logs/update-user-logs.service';
import { RedisService } from './redis.service';
import { ZaService } from './za/za.service';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly redisService: RedisService,
        private readonly zaService: ZaService,
        private logger: LoggerService,
        private getUserService: GetUserService,
        private createUserService: CreateUserService,
        private updateUserService: UpdateUserService,
        private updateUserLogsService: UpdateUserLogsService,
    ) {}

    /**
     * Public function to generate an OTP
     * @param mobile
     * @param firstName
     */
    public async generateOtpCode(mobile: string, firstName: string): Promise<void> {
        const fnc = this.generateOtpCode.name;
        this.logger.debug(LogChannel.AUTH, `Received request to generate OTP for ${mobile}`, fnc, {
            mobile,
            firstName,
        });
        const secret = authenticator.generateSecret(24);
        const otpCode = authenticator.generate(secret);
        await this.redisService.setKey(mobile, otpCode);
        if (getENV() !== EnvironmentOptions.develop) {
            const twilio = new Twilio(config.twilio.sid, config.twilio.authToken);
            const twilioOptions = {
                body: `שלום ${firstName}, הקוד הגישה שלך ל-Road Protect הוא: ${otpCode}`,
                to: `+972${mobile.substring(1)}`,
                from: config.twilio.number,
            };
            try {
                this.logger.debug(LogChannel.AUTH, `Sending an OTP`, fnc, twilioOptions);
                await twilio.messages.create(twilioOptions);
            } catch (exception) {
                this.logger.error(LogChannel.AUTH, `Sending OTP failed with message: ${exception.message}`, fnc, {
                    twilioOptions,
                    stack: exception.stack,
                });
            }
        } else {
            this.logger.debug(
                LogChannel.AUTH,
                `Not sending OTP because we are in development mode... use ${otpCode} to login!`,
                fnc,
            );
        }
    }

    /**
     * Public function to authenticate a user
     * @param authorizationRequest
     * @param request
     */
    public async authenticate(
        authorizationRequest: GetAuthorizationTokenRequestDto,
        request: Request,
    ): Promise<{ user; authorization; userId }> {
        const fnc = this.authenticate.name;
        this.logger.debug(LogChannel.AUTH, `Authenticating from OTP`, fnc, { authorizationRequest });
        const { otpCode, username } = authorizationRequest;
        const [firstName, lastName, mobile] = username.split('_');
        const otpCodeFromRedis = await this.redisService.getKey(mobile);
        // Check if the OTP is valid & if so continue to handle the request
        if (String(otpCode) === String(otpCodeFromRedis) || getENV() === EnvironmentOptions.develop || getENV() === EnvironmentOptions.qa) {
            return this.handleValidOtp(authorizationRequest, request);
        }
        this.logger.error(LogChannel.AUTH, `Failed to authenticate from OTP`, fnc, authorizationRequest);
        // Log filed login if user exists locally
        await this.updateUserLogsService.failedLogin(mobile, authorizationRequest);
        throw new UnauthorizedException('Unauthorized');
    }

    /**
     * Private function to process valid OTP
     * @param authorizationRequest
     * @param request
     */
    private async handleValidOtp(
        authorizationRequest: GetAuthorizationTokenRequestDto,
        request: Request,
    ): Promise<{ user; authorization; userId }> {
        const fnc = this.handleValidOtp.name;
        this.logger.debug(LogChannel.AUTH, `Handling valid otp`, fnc, authorizationRequest);
        const { username } = authorizationRequest;
        const [firstName, lastName, mobile] = username.split('_');
        await this.redisService.deleteKeys(mobile); // delete entry from redis

        try {
            // Check if user exists in local db
            let localUser = await this.getUserService.getByMobile(mobile);

            // If there is no local user, try adding a new lead ticket and add the user on the ZA system and locally
            if (!localUser) {
                this.logger.debug(
                    LogChannel.AUTH,
                    'No user found in database, creating user locally and on ZA system',
                    fnc,
                    authorizationRequest,
                );
                const response = await this.zaService.addLeadTicket({ firstName, lastName, mobile });
                localUser = await this.handleNewUser(authorizationRequest, request);
                this.logger.debug(LogChannel.AUTH, 'Added a new user to the system', fnc, {
                    response,
                    localUser,
                });
            }

            // If the username does not match, update the user on the ZA system and locally
            else if (localUser.username !== authorizationRequest.username) {
                this.logger.debug(
                    LogChannel.AUTH,
                    'Username has been changed, updating user locally and on ZA system',
                    fnc,
                    authorizationRequest,
                );
                localUser = await this.handleChangedUser(localUser.userId, authorizationRequest, request);
            }

            this.logger.debug(LogChannel.AUTH, 'Found the following local user', fnc, localUser);

            // Get an authorization token
            const authorization = await this.zaService.getAuthorizationToken(authorizationRequest);
            request.headers = { 'x-auth-token': authorization.access_token };

            // Get the customer
            const user = await this.zaService.getCustomer(authorizationRequest, request);
            this.logger.debug(LogChannel.AUTH, `Retrieved user information`, fnc, user);

            // Update user logs with successful login
            await this.updateUserLogsService.successfulLogin(localUser);

            return { user, authorization, userId: localUser.userId };
        } catch (e) {
            this.logger.error(LogChannel.AUTH, 'Failed to authenticate user', fnc, e);
            throw new UnauthorizedException('Failed to authenticate user');
        }
    }

    /**
     * Upsert user on the ZA RP system
     * Add user does not throw an error if it is a duplicate
     * @param authorizationRequest
     * @param request
     */
    private async upsertUserOnZaSystem(
        authorizationRequest: GetAuthorizationTokenRequestDto,
        request: Request,
    ): Promise<GetCustomerResponseDTO> {
        const { username } = authorizationRequest;
        const [firstName, lastName, mobile] = username.split('_');
        const userRequest = {
            firstName,
            lastName,
            mobileNumber: mobile,
        };
        return this.zaService.addUser(userRequest, request);
    }

    /**
     * Handle a new user
     * @param authorizationRequest
     * @param request
     */
    private async handleNewUser(authorizationRequest: GetAuthorizationTokenRequestDto, request: Request) {
        const user = await this.upsertUserOnZaSystem(authorizationRequest, request);
        const localUser = plainToClass(CreateUserDto, {
            ...user,
            mobileNumber: user.mobile,
            roadProtectZAId: user.id,
        });

        return this.createUserService.create(localUser);
    }

    /**
     * Handle a changed user
     * @param id
     * @param authorizationRequest
     * @param request
     */
    private async handleChangedUser(
        id: number,
        authorizationRequest: GetAuthorizationTokenRequestDto,
        request: Request,
    ) {
        const user = await this.upsertUserOnZaSystem(authorizationRequest, request);

        const localUser = plainToClass(UpdateUserDto, {
            ...user,
            mobileNumber: user.mobile,
            roadProtectZAId: user.id,
        });

        return this.updateUserService.update(id, localUser);
    }
}
