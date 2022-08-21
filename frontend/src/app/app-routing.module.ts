import { IdUploadComponent } from './components/appeal/id-upload/id-upload.component';
import { AboutUsComponent } from './components/landing/about-us/about-us.component';
import { ContactUsComponent } from './components/landing/contact-us/contact-us.component';
import { LegalParagraphComponent } from './components/appeal/legal-paragraph/legal-paragraph.component';
import { SummaryComponent } from './components/appeal/payment-summary/summary/summary.component';
import { AppealDetailsComponent } from './components/appeal/appeal-details/appeal-details.component';
import { FinePicsComponent } from './components/appeal/fine-pics/fine-pics.component';
import { AppealComponent } from './components/appeal/appeal.component';
import { LeadComponent } from './components/landing/lead/lead.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnBoardingComponent } from './components/landing/on-boarding/on-boarding.component';
import { FineDetailsComponent } from './components/appeal/fine-details/fine-details.component';
import { UserInfoComponent } from './components/appeal/user-info/user-info.component';
import { FinishedComponent } from './components/appeal/finished/finished.component';
import { PaymentComponent } from './components/appeal/payment-summary/payment/payment.component';
import { PnSComponent } from './components/appeal/payment-summary/pns.component';
import { PricingComponent } from './components/landing/pricing/pricing.component';
import { TermsAndConditionsComponent } from './components/landing/terms-and-conditions/terms-and-conditions.component';
import { OtpEntryComponent } from './components/landing/otp-entry/otp-entry.component';
import { ANGULAR_ENDPOINTS } from './config/frontend-endpoints';
import { AuthGuard } from './core/guards/auth.guard';
import { CurrentAppealGuard } from './core/guards/current-appeal.guard';
import { SummaryGuard } from './core/guards/summary.guard';
import { FineDetailsGuard } from './core/guards/fine-details.guard';
import { AppealDetailsGuard } from './core/guards/appeal-details.guard';
import { PicsGuard } from './core/guards/pics.guard';
import { UserInfoGuard } from './core/guards/user-info.guard';
import { TicketSelectionComponent } from './components/appeal/ticket-selection/ticket-selection.component';
import { TicketsResolver } from './core/resolvers/ticket-selection.resolver';
import { OTPConfirmGuard } from './core/guards/otp-confirm.guard';
import { FinishedGuard } from './core/guards/finished.guard';
import { PaymentResolver } from './core/resolvers/payment.resolver';

const routes: Routes = [
    { path: '', redirectTo: ANGULAR_ENDPOINTS.appealsHome, pathMatch: 'full' },
    { path: ANGULAR_ENDPOINTS.defaultLanding, component: OnBoardingComponent },
    { path: ANGULAR_ENDPOINTS.terms, component: TermsAndConditionsComponent },
    { path: ANGULAR_ENDPOINTS.contactUs, component: ContactUsComponent },
    { path: ANGULAR_ENDPOINTS.aboutUs, component: AboutUsComponent },
    { path: ANGULAR_ENDPOINTS.cost, component: PricingComponent },
    {
        path: ANGULAR_ENDPOINTS.login,
        children: [
            { path: '', component: LeadComponent },
            { path: ANGULAR_ENDPOINTS.otpConfirm, component: OtpEntryComponent, canActivate: [OTPConfirmGuard] },
        ],
    },
    {
        path: ANGULAR_ENDPOINTS.appealsHome,
        component: AppealComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: TicketSelectionComponent,
            },
            // TODO: Move the appeal create/edit flow into a sub-route based on id maybe
            {
                path: ANGULAR_ENDPOINTS.appealFineDetails,
                component: FineDetailsComponent,
                canActivate: [CurrentAppealGuard, FineDetailsGuard],
            },
            {
                path: ANGULAR_ENDPOINTS.appealDetails,
                component: AppealDetailsComponent,
                canActivate: [CurrentAppealGuard, AppealDetailsGuard],
            },
            {
                path: ANGULAR_ENDPOINTS.appealPics,
                component: FinePicsComponent,
                canActivate: [CurrentAppealGuard, PicsGuard],
            },
            {
                path: ANGULAR_ENDPOINTS.appealUserInfo,
                component: UserInfoComponent,
                canActivate: [CurrentAppealGuard, UserInfoGuard],
            },
            {
                path: ANGULAR_ENDPOINTS.appealIdUpload,
                component: IdUploadComponent,
                canActivate: [CurrentAppealGuard, UserInfoGuard],
            },
            {
                path: ANGULAR_ENDPOINTS.appealSummary,
                component: PnSComponent,
                canActivate: [CurrentAppealGuard, SummaryGuard],
                children: [
                    { path: '', component: SummaryComponent },
                    { path: ANGULAR_ENDPOINTS.appealPayment, component: PaymentComponent },
                    { path: ANGULAR_ENDPOINTS.appealLastStep, component: LegalParagraphComponent },
                ],
            },
            {
                path: ANGULAR_ENDPOINTS.appealFinished,
                component: FinishedComponent,
                canActivate: [CurrentAppealGuard, FinishedGuard],
            },
            { path: '**', redirectTo: ANGULAR_ENDPOINTS.appealFineDetails, pathMatch: 'full' },
        ],
    },
    { path: '**', redirectTo: ANGULAR_ENDPOINTS.welcome, pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
