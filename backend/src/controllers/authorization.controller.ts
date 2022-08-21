import { Body, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticateWithOTPRequestDto } from '../dto/authenticate-with-otp-request.dto';
import { GetAuthorizationTokenRequestDto } from '../dto/get-authorization-token-request.dto';
import { MyController } from '../helpers/decorators';
import { AuthorizationService } from '../services/authorization.service';

@MyController('authorization', 'Authorization')
export default class AuthorizationController {
    constructor(private readonly authorizationService: AuthorizationService) {}

    @Post('/')
    public async generateOTPCode(@Body() authenticateWithOTPRequest: AuthenticateWithOTPRequestDto) {
        const { mobile, firstName } = authenticateWithOTPRequest;
        await this.authorizationService.generateOtpCode(mobile, firstName);
        return {};
    }

    @Post('/authenticate')
    public async getAuthorizationToken(
        @Body() authorizationRequest: GetAuthorizationTokenRequestDto,
        @Req() request: Request,
    ): Promise<{ user; authorization; userId }> {
        return await this.authorizationService.authenticate(authorizationRequest, request);
    }
}
