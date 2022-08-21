import { FormControl } from '@angular/forms';

export function IdentityCardNumberValidator(control: FormControl): { IdentityCardNumber: boolean } | null {
    let id = String(control.value).trim();
    if (id.length > 9 || id.length < 5) {
        return { IdentityCardNumber: false };
    }
    id = id.length < 9 ? ('00000000' + id).slice(-9) : id;

    return Array.from(id, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
    }) %
        10 ===
        0
        ? null
        : { IdentityCardNumber: false };
}
