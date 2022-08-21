import { readFileSync } from 'fs';
import { resolve } from 'path';

export default (csvFilePath: string, spreadOperator: string = ','): any[] => {
    const result = [] as any[];
    try {
        const dataString = readFileSync(resolve(csvFilePath), { encoding: 'utf8' });
        const lines = dataString.replace(/\r/g, '').split('\n');
        const headers = lines[0].split(spreadOperator);

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(spreadOperator);
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
    } catch (ex) {
        console.log(`csvHelper err`, ex);
    }

    return result;
};
