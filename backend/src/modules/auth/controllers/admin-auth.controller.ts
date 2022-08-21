import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SystemAdminGuard } from '../guards/system-admin.guard';
import { AuthService } from '../services/auth.service';
import { GenerateApiUserTokenDto } from './generate-api-user-token.dto';
import { LoginResponseDto } from './login-response.dto';
import { LoginDto } from './login.dto';

@Controller('authorization/admin')
export class AdminAuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiExcludeEndpoint()
    async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        return await this.authService.login(dto);
    }

    @Post('generate-api-user-token')
    @UseGuards(AuthGuard(), SystemAdminGuard)
    @ApiExcludeEndpoint()
    async generateApiUserToken(@Body() dto: GenerateApiUserTokenDto): Promise<{ token: string }> {
        return this.authService.generateApiUserToken(dto);
    }
}
