import { Argv } from 'yargs';

export class ScriptDescription {
    readonly command: string;
    readonly description: string;
    readonly modifier: (yargs: Argv) => any;

    constructor(obj: any = {}) {
        this.command = obj.command;
        this.description = obj.description;
        this.modifier = obj.modifier;
    }

    getCommandOnly(): string {
        const parts = this.command.split(' ');
        if (parts && parts.length > 0) {
            return parts[0];
        }
        return this.command;
    }
}
