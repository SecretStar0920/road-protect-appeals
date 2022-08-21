import { LoggerService } from '@logger';
import { BadRequestException, INestApplication } from '@nestjs/common';
import * as chalk from 'chalk';
import { LogChannel } from '../../../config/logs';
import { Script } from '../script';
import { ScriptDescription } from '../script-description';
import { User } from '@database/entities/user.entity';
import { Argv } from 'yargs';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { GenerateApiUserTokenDto } from '../../../modules/auth/controllers/generate-api-user-token.dto';

export class GenerateAuthToken extends Script {
    description = new ScriptDescription({
        command: 'auth-token:gen',
        description: 'Generates an authentication token for coupons using Auth Service.',
        modifier: (yargs: Argv) => {
            return yargs.options({
                m: {
                    alias: 'mobile',
                    describe: 'Specify user mobile number',
                    default: null,
                    demandOption: true,
                    string: true,
                },
            });
        },
    });

    async run(app: INestApplication, logger: LoggerService, args: any = {}): Promise<void> {
        logger.info(LogChannel.CLI, chalk.default.blueBright('Generating coupon authentication token'), this.run.name);
        const authService = app.get(AuthService);

        const mobileNumber = args.mobile;
        const user = await User.findOne({ mobileNumber });
        let result: object | undefined;

        if (!!user) {
            const generateApiUserTokenDto: GenerateApiUserTokenDto = { mobile: mobileNumber, userId: user.userId };
            result = await authService.generateApiUserToken(generateApiUserTokenDto);
        }
        if (!!result) {
            logger.info(
                LogChannel.CLI,
                chalk.default.greenBright('Generated coupon authentication token complete!'),
                this.run.name,
                result,
            );
        } else {
            logger.error(
                LogChannel.CLI,
                chalk.default.bgBlackBright('Could not generate authentication token'),
                this.run.name,
            );
        }
    }
}
