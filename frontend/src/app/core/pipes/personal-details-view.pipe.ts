import { Pipe, PipeTransform } from '@angular/core';
import translations from '../translations/translations.json';
@Pipe({
    name: 'personalDetailsView',
})
export class PersonalDetailsViewPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return translations[value];
    }
}
