import { User, UserType } from '@database/entities/user.entity';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SystemAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const user: User = request.user;
        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const isSystemAdmin = user.type === UserType.Developer || user.type === UserType.Admin;
        if (!isSystemAdmin) {
            throw new ForbiddenException('You must be a System Administrator to perform this action');
        }
        return true;
    }
}
