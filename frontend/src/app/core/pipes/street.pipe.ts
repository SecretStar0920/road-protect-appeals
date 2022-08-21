import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'streetDisplay',
})
export class StreetPipe implements PipeTransform {
    transform(value: any): any {
        const [street, houseNumber] = value.split('_');
        return houseNumber ? `${street} ${houseNumber}` : street;
    }
}
