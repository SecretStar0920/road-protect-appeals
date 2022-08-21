import { initialiseConfig } from './initialise-config';
initialiseConfig();

import 'reflect-metadata';
import config, { getENV } from './config';
import { ControllerDetailLogger } from './middlewares/controller-detail-logger.interceptor';
import { RequestBodyModify } from './middlewares/request-body-modify.middleware';
import { createSwagger, printSwaggerDetails } from './helpers/swagger.helper';
import addBodyParser from './middlewares/add-body-parser.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CheckTokenMiddleware } from './middlewares/check-token.middleware';
import express from 'express';
import { join } from 'path';
import { LoggerService } from '@logger';

async function boostrap() {
    console.debug(`App Starting with ${getENV()} config`);

    const app = await NestFactory.create(AppModule);

    createSwagger(app);
    addBodyParser(app);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            validationError: {
                target: false,
                value: false,
            },
            whitelist: true,
        }),
    );
    app.use(CheckTokenMiddleware);
    app.use(RequestBodyModify);
    app.use('/temp', express.static(join(__dirname, './temp')));

    app.useGlobalInterceptors(new ControllerDetailLogger(LoggerService.instance));

    app.setGlobalPrefix(config.app.apiPrefix);
    // app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(config.app.port);
    console.debug('Server Listening on ' + config.app.port);
    printSwaggerDetails();
}

boostrap().catch(err => {
    console.log('Service Crash');
    console.error(err);
    process.exit(1);
});
