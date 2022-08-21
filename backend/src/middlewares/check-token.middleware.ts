import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';

export async function CheckTokenMiddleware(request: Request, response: Response, next: NextFunction) {
    if (
        !request.headers['X-Auth-Token'] &&
        !request.headers['x-auth-token'] &&
        !request.url.includes('authorization') &&
        !request.url.includes('temp') &&
        !request.url.includes('payment') &&
        !request.url.includes('coupon') &&
        request.path !== '/api' &&
        request.path !== '/' &&
        request.path !== '' &&
        request.path !== '/api/health' &&
        request.path !== '/api/contact-us'
    ) {
        return response.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    await next();
}
