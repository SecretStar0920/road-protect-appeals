import { LoggerService } from '@logger';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogChannel } from '../../../config/logs';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly logger: LoggerService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        this.logger.warn(LogChannel.AUTH, 'Permission guard not implemented!', this.canActivate.name);
        return true;
    }
}
