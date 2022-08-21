import { forwardRef, Module } from '@nestjs/common';
import { RealtimeGateway } from './gateways/realtime.gateway';
import { ClientNotificationService } from './client-notification/client-notification.service';
import { LoggerService } from '@logger';
import { SharedModule } from '../../shared.module';

@Module({
    imports: [forwardRef(() => SharedModule)],
    providers: [RealtimeGateway, ClientNotificationService, LoggerService],
    exports: [RealtimeGateway, ClientNotificationService],
    controllers: [],
})
export class RealtimeModule {}
