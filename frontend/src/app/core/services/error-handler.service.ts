import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';

import { PopupService } from './popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    constructor(private popupService: PopupService) {}

    handleHttpError(err: any): Observable<any> {
        console.log('err: ', err);
        if (!err.status) {
            this.popupService.openDialog({ title: 'שגיאה', content: 'שגיאה כללית' });
        } else {
            switch (err.status) {
                case 401:
                    this.popupService.openDialog({ title: 'שגיאה', content: 'שגיאה כללית' });
                    break;
                case 403:
                    this.popupService.openDialog({ title: 'שגיאה', content: 'שגיאה כללית' });
                    break;
                case 500:
                    this.popupService.openDialog({ title: 'שגיאה', content: 'שגיאה כללית' });
                    break;
                case 504:
                    this.popupService.openDialog({ title: 'שגיאה', content: 'שגיאה כללית' });
                    break;
            }
        }
        return throwError(err);
    }

    handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `an error occured: ${err.error.message}`;
        } else {
            errorMessage = `server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}
