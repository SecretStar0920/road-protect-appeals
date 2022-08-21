import { LoggerService } from '@logger';
import { LogChannel } from '../../../config/logs';

export abstract class BaseSeederService {
    protected abstract seederName: string;

    protected constructor(protected logger: LoggerService = LoggerService.instance) {}

    abstract async seedData();

    async run() {
        this.logger.debug(LogChannel.CLI, `[${this.seederName}] - starting...`, this.run.name);
        await this.seedData();
        this.logger.debug(LogChannel.CLI, `[${this.seederName}] - completed \u2714 `, this.run.name);
    }
}
