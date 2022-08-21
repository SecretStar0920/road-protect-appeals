import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ContactUsService {
    constructor(private http: HttpClient) {}

    public async submitContactForm(body: any): Promise<any> {
        const localUrl = `${environment.baseUrl}/contact-us`;
        return this.http.post<any>(localUrl, body).toPromise();
    }
}
