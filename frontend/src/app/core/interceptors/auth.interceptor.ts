import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PopupService } from '../services/popup.service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptorService {
    constructor(private readonly router: Router, private readonly popupService: PopupService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!req.url.includes('api') || req.url.includes('authorization')) {
            return next.handle(req);
        }

        const request = req.clone({
            headers: new HttpHeaders({
                'X-Auth-Token': localStorage.getItem('token') || '',
            }),
        });

        return next.handle(request).pipe(
            catchError((err: any) => {
                if (!environment.production) {
                    console.error(err);
                }

                if (err instanceof HttpErrorResponse && err.status === 401) {
                    this.popupService.openDialog({
                        title: 'שגיאה בעיבוד הבקשה',
                        content: 'אנא התחבר שנית למערכת',
                    });
                    this.router.navigate(['/start']);
                } else if (err instanceof HttpErrorResponse && err.status === 400) {
                    this.popupService.openDialog({
                        title: 'שגיאה',
                        content: err.error.message,
                    });
                } else {
                    this.popupService.openDialog({
                        title: 'שגיאה',
                        content: err.error,
                    });
                }
                return of(err);
            }),
        );
    }
}
