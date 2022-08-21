import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { OnBoardingInput } from './on-boarding-input';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class OnBoardingPropertyBagService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    jsonUrl: string = './assets/on-boarding.json';
    activePage: number;

    getData(): Observable<OnBoardingInput[]> {
        return this.http.get<OnBoardingInput[]>(this.jsonUrl).pipe(catchError(this.errorHandler.handleError));
    }
}
