import { Injectable } from '@nestjs/common';
import { Namespace } from 'socket.io';

export class ClientNotificationDto {
    message: string;
    event?: string;
    type?: string;
    data?: any;
}

@Injectable()
export class ClientNotificationService {
    notify(socket: Namespace, notification: ClientNotificationDto) {
        if (!notification.event) {
            notification.event = 'notification';
        }
        socket.emit(notification.event, notification);
    }
}
