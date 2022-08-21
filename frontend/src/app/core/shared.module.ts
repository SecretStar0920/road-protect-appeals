import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { PopupService } from './services/popup.service';
import { CrudService } from './services/crud.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { MaterialModule } from '../material.module';
import { HeaderComponent } from '../components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ImgPathService } from './services/img-path.service';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LicensePlatePipe } from './pipes/license-plate.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TicketsResolver } from './resolvers/ticket-selection.resolver';
import { StreetPipe } from './pipes/street.pipe';
import { TicketStatusPipe } from './pipes/ticket-status.pipe';
import { RpButtonComponent } from './components/rp-button/rp-button.component';
import { PaymentResolver } from './resolvers/payment.resolver';
import { SafeUrlPipe } from './pipes/safe.url.pipe';
import { PreviewPdfComponent } from './components/preview-pdf/preview.pdf.component';

const decs = [
    ErrorDialogComponent,
    HeaderComponent,
    LicensePlatePipe,
    SafeHtmlPipe,
    StreetPipe,
    TicketStatusPipe,
    RpButtonComponent,
    SafeUrlPipe,
    PreviewPdfComponent,
];

const imps = [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularSvgIconModule,
    NgxMaterialTimepickerModule,
];

@NgModule({
    declarations: [...decs],
    imports: imps,
    exports: [...decs, ...imps],
    providers: [ErrorHandlerService, PopupService, CrudService, ImgPathService, TicketsResolver, PaymentResolver],
    entryComponents: [ErrorDialogComponent],
})
export class SharedModule {}
