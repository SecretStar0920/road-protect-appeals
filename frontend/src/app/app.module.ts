import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalComponent } from './components/appeal/appeal-details/modal/modal.component';
import { AppealModule } from './components/appeal/appeal.module';
import { WarningModalComponent } from './components/appeal/fine-details/warning-modal/warning-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutUsComponent } from './components/landing/about-us/about-us.component';
import { AboutUsModule } from './components/landing/about-us/about-us.module';
import { ContactDetailsComponent } from './components/landing/contact-us/contact-details/contact-details.component';
import { ContactFormComponent } from './components/landing/contact-us/contact-form/contact-form.component';
import { ContactUsComponent } from './components/landing/contact-us/contact-us.component';
import { ContactUsModule } from './components/landing/contact-us/contact-us.module';
import { LeadComponent } from './components/landing/lead/lead.component';
import { OnBoardingComponent } from './components/landing/on-boarding/on-boarding.component';
import { OtpEntryComponent } from './components/landing/otp-entry/otp-entry.component';
import { PricingModule } from './components/landing/pricing/pricing.module';
import { TermsAndConditionsComponent } from './components/landing/terms-and-conditions/terms-and-conditions.component';
import { DATE_FORMAT } from './core/helpers/date-picker-format';
import { CustomReuseStrategy } from './core/helpers/reuse-stratergy';
import { AuthInterceptorService } from './core/interceptors/auth.interceptor';
import { SpinnerInterceptor } from './core/interceptors/spinner.interceptor';
import { SharedModule } from './core/shared.module';
import { environment } from '../environments/environment';
import { SubmitModalComponent } from './components/appeal/appeal-details/submit-modal/submit-modal.component';
import { RealtimeModule } from './core/modules/realtime/realtime.module';
import { HttpSocketIdInterceptor } from './core/services/http/http-socket-id-interceptor.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

export function tokenGetter() {
    return localStorage.getItem('jwt');
}

export function socketIdGetter() {
    return sessionStorage.getItem('io');
}

const config: SocketIoConfig = { url: '', options: { autoConnect: false } };

@NgModule({
    entryComponents: [ModalComponent, WarningModalComponent, SubmitModalComponent],
    declarations: [
        AppComponent,
        OnBoardingComponent,
        LeadComponent,
        ModalComponent,
        SubmitModalComponent,
        TermsAndConditionsComponent,
        OtpEntryComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        AppealModule,
        SharedModule,
        RealtimeModule,
        BrowserAnimationsModule,
        MatDialogModule,
        JwtModule.forRoot({
            config: {
                tokenGetter,
                whitelistedDomains: [],
                blacklistedRoutes: [],
            },
        }),
        SocketIoModule.forRoot(config),
        ContactUsModule,
        AboutUsModule,
        PricingModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpSocketIdInterceptor, multi: true },
        {
            provide: 'googleTagManagerId',
            useValue: environment.googleTagManagerId,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
