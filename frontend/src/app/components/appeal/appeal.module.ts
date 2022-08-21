import { SharedModule } from '../../core/shared.module';
import { AppealFlowStepsComponent } from './appeal-flow-steps/appeal-flow-steps.component';
import { AppealFlowWrapperComponent } from './appeal-flow-wrapper/appeal-flow-wrapper.component';
import { AppealComponent } from './appeal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FineDetailsComponent } from './fine-details/fine-details.component';
import { FinePicsComponent } from './fine-pics/fine-pics.component';
import { AppealDetailsComponent } from './appeal-details/appeal-details.component';
import { FinishedComponent } from './finished/finished.component';
import { IdUploadComponent } from './id-upload/id-upload.component';
import { PayByCouponComponent } from './payment-summary/payment/pay-by-coupon/pay-by-coupon.component';
import { PayByCreditCardComponent } from './payment-summary/payment/pay-by-credit-card/pay-by-credit-card.component';
import { PaymentErrorComponent } from './payment-summary/payment/payment-error/payment-error.component';
import { PaymentSuccessComponent } from './payment-summary/payment/payment-success/payment-success.component';
import { TicketSelectionComponent } from './ticket-selection/ticket-selection.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { SummaryComponent } from './payment-summary/summary/summary.component';
import { PersonalDetailsViewPipe } from '../../core/pipes/personal-details-view.pipe';
import { FineDetailsPipe } from '../../core/pipes/fine-details.pipe';
import { FooterComponent } from './appeal-details/footer/footer.component';
import { PaymentComponent } from './payment-summary/payment/payment.component';
import { PnSComponent } from './payment-summary/pns.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LegalParagraphComponent } from './legal-paragraph/legal-paragraph.component';
import { WarningModalComponent } from './fine-details/warning-modal/warning-modal.component';
import { TicketSelectionItemComponent } from './ticket-selection/ticket-selection-item/ticket-selection-item.component';
import { SavedReasonsService } from './appeal-details/services/saved-reasons.service';
import { CurrentPathService } from './appeal-details/services/current-path.service';
import { LegalParagraphService } from './legal-paragraph/service/legal-paragraph.service';

const decs = [
    FineDetailsComponent,
    FinePicsComponent,
    AppealDetailsComponent,
    UserInfoComponent,
    SummaryComponent,
    AppealComponent,
    PersonalDetailsViewPipe,
    FineDetailsPipe,
    AppealComponent,
    FooterComponent,
    PaymentComponent,
    PnSComponent,
    LegalParagraphComponent,
    WarningModalComponent,
    AppealFlowStepsComponent,
    AppealFlowWrapperComponent,
    IdUploadComponent,
    FinishedComponent,
    TicketSelectionItemComponent,
    TicketSelectionComponent,
    PayByCreditCardComponent,
    PayByCouponComponent,
    PaymentSuccessComponent,
    PaymentErrorComponent,
];
const imps = [CommonModule, SharedModule, MatProgressBarModule];

@NgModule({
    declarations: decs,
    imports: imps,
    exports: [...decs, ...imps],
    providers: [SavedReasonsService, CurrentPathService, LegalParagraphService],
})
export class AppealModule {}
