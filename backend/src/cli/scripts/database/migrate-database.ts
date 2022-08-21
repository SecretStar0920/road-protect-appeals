import { INestApplicationContext } from '@nestjs/common';
import { getConnection } from 'typeorm';
import * as chalk from 'chalk';
import { Script } from '../script';
import { ScriptDescription } from '../script-description';
import { LoggerService } from '@logger';
import { LogChannel } from '../../../config/logs';
import { environment } from '../../../config/environment';
import { databases } from '../../../config/databases';

export class MigrateDatabase extends Script {
    description = new ScriptDescription({
        command: 'database:migrate',
        description: 'Drops all tables on the database and recreates them.',
        modifier: yargs => {
            return yargs.option('f', {
                alias: 'force',
                boolean: true,
                default: false,
                describe: `Force migration to take place even if it's in production.`,
            });
        },
    });

    async run(app: INestApplicationContext, logger: LoggerService, args: any = {}): Promise<void> {
        logger.info(
            LogChannel.CLI,
            chalk.default.bgRed('Migrating the database, this is a DESTRUCTIVE operation!'),
            this.run.name,
        );

        // Quit if this is production and you're trying to migrate the database.
        if (environment.isProd() && !args.force) {
            logger.error(
                LogChannel.CLI,
                chalk.default.bgRed(
                    'You are trying to migrate a database in a production environment. Use the --force option if this is intentional.',
                ),
                this.run.name,
            );
            process.exit(1);
        }

        // Migrate the current database
        const mainConnection = getConnection(databases.main.name);

        // Drop the database before sync (that's what the true represents in this
        // function call)
        await mainConnection.synchronize(true);

        logger.info(LogChannel.CLI, chalk.default.bgGreen('Migration complete!'), this.run.name);
    }
}
