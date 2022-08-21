import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { FRONTEND_ENDPOINTS } from '../../config/frontend-endpoints';
import { CustomerModel } from '../models/customer.model';
import { CrudService } from './crud.service';
import { CurrentUserService } from './current-user.service';
import { TicketService } from './ticket.service';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';

export class ILoginResponse {
    username: string;
    roles: Array<string>;
    // tslint:disable-next-line:variable-name
    access_token: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private loggedIn: boolean = false;
    private readonly jwtHelper: JwtHelperService = new JwtHelperService();
    public decodedToken;

    get isLoggedIn(): boolean {
        return this.loggedIn;
    }

    constructor(
        private readonly httpClient: HttpClient,
        private readonly crudService: CrudService,
        private readonly ticketService: TicketService,
        private readonly router: Router,
        private readonly popupService: PopupService,
        private readonly currentUserService: CurrentUserService,
    ) {}

    public async authorizeWithOTP(mobile: string) {
        const firstName = this.ticketService.userInfo.get('firstName').value.trim();
        await this.httpClient
            .post<void>(`${environment.baseUrl}/authorization`, { mobile, firstName })
            .toPromise();
        this.router.navigate(['start', 'confirm']);
    }

    public async authorizeUser(otpCode: string) {
        const firstName = this.ticketService.userInfo.get('firstName').value.trim();
        const lastName = this.ticketService.userInfo.get('lastName').value.trim();
        const mobile =
            this.ticketService.userInfo.get('phonePrefix').value.trim() +
            this.ticketService.userInfo.get('phone').value.trim();
        const username = `${firstName}_${lastName}_${mobile}`;
        const password = mobile.trim();
        try {
            const response = await this.httpClient
                .post<any>(`${environment.baseUrl}/authorization/authenticate`, {
                    username,
                    password,
                    otpCode,
                })
                .toPromise();
            const { authorization, user, userId } = response;
            localStorage.setItem('token', authorization.access_token);
            localStorage.setItem('user_id', userId);
            this.patchUser(user);
            this.loggedIn = true;
            this.currentUserService.user = {
                mobileNumber: mobile.trim(),
            };
            this.router.navigate(['/appeal']);
        } catch (e) {
            console.error(e);
            // this.popupService.openDialog({ title: 'שגיאה', content: 'הקוד שהוזן אינו תקין!' });
        }
    }

    public decodeToken(token: string): void {
        this.decodedToken = this.jwtHelper.decodeToken(token);
    }

    public logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        this.loggedIn = false;
        this.currentUserService.user = null;
        this.router.navigate([FRONTEND_ENDPOINTS.welcome]);
    }

    public async verifyLogin(): Promise<boolean> {
        if (this.loggedIn) {
            return true;
        }
        const token = localStorage.getItem('token');
        const isTokenExpired = this.jwtHelper.isTokenExpired(token);

        if (isTokenExpired) {
            this.logout();
            return false;
        }

        const userId = localStorage.getItem('user_id');

        if (!userId) {
            this.logout();
            return false;
        }

        const user = await this.crudService.getCustomer(userId);

        if (!user) {
            this.logout();
            return false;
        }
        this.patchUser(user);
        this.ticketService.userInfo.get('tncAgreement').setValue(true);
        this.loggedIn = true;
        this.currentUserService.user = {
            mobileNumber: user.mobile,
        };
        return true;
    }

    private patchUser(user: CustomerModel) {
        this.ticketService.userInfo.patchValue(user);
        if (user.address) {
            const [street, houseNumber] = user.address.split('_');
            this.ticketService.userInfo.get('address').patchValue(street);
            this.ticketService.userInfo.get('houseNumber').patchValue(houseNumber);
        }

        if (user.mobile) {
            this.ticketService.userInfo.get('mobile').patchValue(user.mobile);
            this.ticketService.userInfo.get('phonePrefix').patchValue(user.mobile.slice(0, 3));
            this.ticketService.userInfo.get('phone').patchValue(user.mobile.slice(3, user.mobile.length));
        }
    }
}
