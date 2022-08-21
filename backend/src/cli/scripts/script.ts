import { LoggerService } from '@logger';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ScriptDescription } from './script-description';

export abstract class Script {
    description: ScriptDescription;

    async init(): Promise<INestApplication> {
        // Wait for the app to start up so that we know TypeOrm is sorted
        const app = await NestFactory.create(AppModule, {
            logger: false,
        });

        return app;
    }

    async execute(args: any = {}): Promise<void> {
        const app = await this.init();
        const logger = LoggerService.instance;
        await this.run(app, logger, args);
        process.exit(0);
    }

    abstract async run(app: INestApplication, logger: LoggerService, args: any): Promise<void>;
}
