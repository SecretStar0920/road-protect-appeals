import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'licensePlate',
})
export class LicensePlatePipe implements PipeTransform {
    transform(value: any, ...args: any[]): string {
        value = value.toString();
        switch (value.length) {
            case 6:
                return `${value.slice(0, 3)}-${value.slice(3, 6)}`;
            case 7:
                return `${value.slice(0, 2)}-${value.slice(2, 5)}-${value.slice(5, 7)}`;
            case 8:
                return `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 8)}`;
            default:
                return value;
        }
    }
}
