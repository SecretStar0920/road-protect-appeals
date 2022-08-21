import config from '@config';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import chalk from 'chalk';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { get, some } from 'lodash';
import { LoggerService } from '@logger';
import { LogChannel } from '../config/logs';

@Injectable()
export class ControllerDetailLogger implements NestInterceptor {
    public static omit: string[] = ['/api/health'];

    public static functionCounts: {
        [method: string]: {
            count: number;
            totalTime: number;
        };
    } = {};

    constructor(private logger: LoggerService) {}

    private getDiffSeverity(diff: number) {
        if (diff <= 100) {
            return chalk.greenBright;
        } else if (diff <= 500 && diff > 100) {
            return chalk.yellowBright;
        } else {
            return chalk.redBright;
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();

        const request: Request = context.switchToHttp().getRequest();

        // Omit certain routes
        if (some(ControllerDetailLogger.omit, url => url === request.url)) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(() => {
                if (config.logs.interceptor.executionTime) {
                    this.logExecutionTime(startTime, request);
                }
            }),
        );
    }

    private logExecutionTime(start, req: Request) {
        const diff = Date.now() - start;
        const functionCount = ControllerDetailLogger.functionCounts[req.url] || {
            count: 0,
            totalTime: 0,
        };
        functionCount.count += 1;
        functionCount.totalTime += diff;
        ControllerDetailLogger.functionCounts[req.url] = functionCount;

        const message = `time: ${diff}ms, avg: ${Math.round(functionCount.totalTime / functionCount.count)}ms, count: ${
            functionCount.count
        }`;

        this.logger.debug(
            LogChannel.REQUEST,
            '------',
            this.getDiffSeverity(diff)(message),
            `(${req.method}) ${req.url}`,
        );
    }
}
