import { LoggerService } from '@logger';
import { NestFactory } from '@nestjs/core';
import * as appRootPath from 'app-root-path';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { command, showHelpOnFail, usage } from 'yargs';
import { AppModule } from '../app.module';
import { LogChannel } from '../config/logs';
import { SeedDatabase } from './scripts/database/seed-database';
import { Script } from './scripts/script';
import { GeneratePassword } from './scripts/security/generate-password';
import { MigrateDatabase } from './scripts/database/migrate-database';
import { GenerateAuthToken } from './scripts/security/generate-auth-token';

dotenv.config({ path: path.join(appRootPath.path, '.env') });

export class Cli {
    static cliUsage: string = 'cli <cmd> [args]';

    static registered: Script[] = [
        new SeedDatabase(),
        new GeneratePassword(),
        new MigrateDatabase(),
        new GenerateAuthToken(),
    ];

    static async run() {
        const sortedScripts = Cli.sortRegisteredScripts();
        usage(Cli.cliUsage).scriptName('');
        sortedScripts.forEach(script => {
            command(script.description.command, script.description.description, script.description.modifier, args => {
                Cli._run(script, args);
            });
        });
        return showHelpOnFail(true).help().demandCommand().recommendCommands().argv;
    }

    private static async _run(script: Script, args: any) {
        const logger = LoggerService.instance;
        try {
            const app = await NestFactory.create(AppModule, {
                logger: false,
            });
            await script.run(app, logger, args);
            process.exit(0);
        } catch (e) {
            logger.error(LogChannel.CLI, e.message, this._run.name, e.stack);
            process.exit(1);
        }
    }

    private static sortRegisteredScripts(): Script[] {
        return Cli.registered.sort((a, b) => {
            const aCommand = a.description.getCommandOnly();
            const bCommand = b.description.getCommandOnly();
            if (aCommand === bCommand) {
                return 0;
            }
            return aCommand < bCommand ? -1 : 1;
        });
    }
}

Cli.run().catch(e => console.error(e));
