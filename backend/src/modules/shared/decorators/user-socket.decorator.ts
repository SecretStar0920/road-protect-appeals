import { createParamDecorator } from '@nestjs/common';
import { get, isNil } from 'lodash';
import { LoggerService } from '@logger';
import { LogChannel } from '../../../config/logs';
import { RealtimeGateway } from '../modules/realtime/gateways/realtime.gateway';

export const safeSocket = {
    emit: (...args) => {
        LoggerService.instance.warn(
            LogChannel.SOCKET,
            'Socket emit called, but no real instance connected',
            'safeSocket',
            args,
        );
        return {
            message: 'No socket connected ',
            ...args,
        };
    },
};

// tslint:disable-next-line:variable-name
export const UserSocket = createParamDecorator((data, req) => {
    if (isNil(RealtimeGateway.server)) {
        return safeSocket;
    }

    if (!get(req, 'headers.io', false)) {
        return safeSocket;
    }

    const socketId = get(req, 'headers.io');
    return RealtimeGateway.server.sockets.connected[socketId] || safeSocket;
});
