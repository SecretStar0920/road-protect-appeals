import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketManagementService } from '../../modules/realtime/services/socket-management.service';

@Injectable()
export class HttpSocketIdInterceptor implements HttpInterceptor {
    constructor(private socket: SocketManagementService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const socketId = sessionStorage.getItem('io') || this.socket.socketId;
        if (socketId) {
            const socketReq = request.clone({ headers: request.headers.set('io', socketId) });
            return next.handle(socketReq);
        } else {
            return next.handle(request);
        }
    }
}
