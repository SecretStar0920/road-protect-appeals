import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GlobalLoadingService {
    public loading: number = 0;
}
