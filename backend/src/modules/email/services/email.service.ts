import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

@Injectable()
export class EmailService {
    async getTemplate(templateName: string, context: any): Promise<string> {
        const raw = await fs
            .readFile(path.resolve(__dirname, `../resources/emails/${templateName}.hbs`))
            .then(template => template.toString());
        const template = Handlebars.compile(raw);
        return template(context);
    }
}
