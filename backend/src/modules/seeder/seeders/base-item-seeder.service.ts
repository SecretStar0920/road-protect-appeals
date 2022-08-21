import { LoggerService } from '@logger';
import { LogChannel } from '../../../config/logs';
import { BaseSeederService } from './base-seeder.service';

export abstract class BaseItemSeederService<T = any> extends BaseSeederService {
    protected data: Array<Partial<T>> = [];

    protected constructor(protected logger: LoggerService = LoggerService.instance) {
        super();
    }

    abstract async setSeedData();
    abstract async seedItemFunction(item: Partial<T>);

    async run() {
        await this.setSeedData();
        this.logger.debug(LogChannel.CLI, `[${this.seederName}] - starting...`, this.run.name);
        await this.seedData();
        this.logger.debug(LogChannel.CLI, `[${this.seederName}] - completed \u2714 `, this.run.name);
    }

    async seedData() {
        // For each seed item
        for (const item of this.data) {
            await this.onSeedItem(item);
        }
    }

    async onSeedItem(item: Partial<T>) {
        this.onItemStart(item);
        await this.seedItemFunction(item);
        this.onItemEnd(item);
    }

    private onItemStart(item: Partial<T>) {
        this.logger.debug(LogChannel.CLI, `[${this.seederName}] - item: `, this.run.name, item);
    }

    private onItemEnd(item: Partial<T>) {
        this.logger.debug(LogChannel.CLI, `[${this.seederName}] - item seeded successfully`, this.run.name);
    }
}
