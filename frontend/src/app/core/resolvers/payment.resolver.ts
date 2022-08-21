import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CrudService } from '../services/crud.service';

@Injectable()
export class PaymentResolver implements Resolve<string> {
    constructor(private readonly crudService: CrudService) {}

    async resolve() {
        const { url } = await this.crudService.doDeal();
        return url;
    }
}
