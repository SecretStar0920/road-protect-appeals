import { Pipe, PipeTransform } from '@angular/core';
import translations from '../translations/translations.json';

@Pipe({
    name: 'fineDetails',
})
export class FineDetailsPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return translations[value];
    }
}
