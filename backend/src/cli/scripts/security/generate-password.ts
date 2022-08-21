import { LoggerService } from '@logger';
import { INestApplication } from '@nestjs/common';
import * as chalk from 'chalk';
import { Argv } from 'yargs';
import { LogChannel } from '../../../config/logs';
import { PasswordService } from '../../../modules/auth/services/password.service';
import { Script } from '../script';
import { ScriptDescription } from '../script-description';

export class GeneratePassword extends Script {
    description = new ScriptDescription({
        command: 'password:gen',
        description: 'Generates a password using PasswordService.',
        modifier: (yargs: Argv) => {
            return yargs.option('p', {
                alias: 'password',
                string: true,
                default: null,
                describe: 'Set input password',
            });
        },
    });

    async run(app: INestApplication, logger: LoggerService, args: any = {}): Promise<void> {
        logger.info(
            LogChannel.CLI,
            chalk.default.blueBright('Generating encrypted password'),
            this.run.name,
            args.password,
        );

        const passwordService = app.get(PasswordService);
        const result = await passwordService.generatePassword(args.password);

        logger.info(LogChannel.CLI, chalk.default.greenBright('Generated password complete!'), this.run.name, result);
    }
}
