import { Script } from '../script';
import { ScriptDescription } from '../script-description';
import { LogChannel } from '../../../config/logs';
import { INestApplication } from '@nestjs/common';
import { LoggerService } from '@logger';
import * as chalk from 'chalk';
import { SeederService } from '../../../modules/seeder/seeder.service';

export class SeedDatabase extends Script {
    description = new ScriptDescription({
        command: 'database:seed',
        description: 'Seeds the database based on the seeders registered in the SeederService.',
        modifier: yargs => {
            return yargs;
        },
    });

    async run(app: INestApplication, logger: LoggerService, args: any = {}): Promise<void> {
        logger.info(LogChannel.CLI, chalk.default.bgRed('Seeding the database'), this.run.name);

        const seederService = app.get(SeederService);
        await seederService.seed();

        logger.info(LogChannel.CLI, chalk.default.bgGreen('Seeding complete!'), this.run.name);
    }
}
