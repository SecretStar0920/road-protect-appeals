import config from '@config';
import { LoggerService } from '@logger';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { PermissionGuard } from './guards/permission.guard';
import { SystemAdminGuard } from './guards/system-admin.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordService } from './services/password.service';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: config.auth.jwt.secret,
            signOptions: {
                expiresIn: config.auth.jwt.expiry,
            },
        }),
    ],
    controllers: [AdminAuthController],
    providers: [AuthService, LoggerService, JwtStrategy, PasswordService, PermissionGuard, SystemAdminGuard],
    exports: [AuthService, JwtStrategy, PassportModule, PasswordService, PermissionGuard, SystemAdminGuard],
})
export class AuthModule {}
