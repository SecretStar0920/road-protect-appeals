import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '@logger';
import { LogChannel } from '../../../../../config/logs';

@WebSocketGateway({ cookie: false })
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private logger: LoggerService) {}

    public static server: Server;

    afterInit(server: Server) {
        RealtimeGateway.server = server;
    }

    handleDisconnect(client: Socket) {
        this.logger.info(
            LogChannel.SOCKET,
            `Client disconnected: ${client.id}`,
            this.handleDisconnect.name,
            this.getConnectedDetails(),
        );
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.info(
            LogChannel.SOCKET,
            `Client connected: ${client.id}`,
            this.handleConnection.name,
            this.getConnectedDetails(),
        );
    }

    getConnectedDetails() {
        const connections = RealtimeGateway.server.sockets.connected;
        const connectedIds = Object.keys(connections);
        const count = connectedIds.length;

        return { count, connectedIds };
    }
}
