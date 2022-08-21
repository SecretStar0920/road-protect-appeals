import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalLoadingService } from '../services/global-loading.service';

@Injectable({
    providedIn: 'root',
})
export class SpinnerInterceptor {
    constructor(private readonly globalLoadingService: GlobalLoadingService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (req.url.includes('api')) {
            this.globalLoadingService.loading += 1;
        }
        return next.handle(req).pipe(
            finalize(() => {
                if (req.url.includes('api')) {
                    this.globalLoadingService.loading -= 1;
                }
            }),
        );
    }
}
