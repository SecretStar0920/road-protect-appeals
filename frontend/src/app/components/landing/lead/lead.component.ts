import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ImgPathService } from '../../../core/services/img-path.service';

@Component({
    selector: 'app-lead',
    templateUrl: './lead.component.html',
    styleUrls: ['./lead.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: {
        class: 'column-grow',
    },
})
export class LeadComponent implements OnInit, OnDestroy {
    unsubscriber$ = new Subject<any>();
    phonePrefixArray = ['050', '051', '052', '053', '054', '055', '056', '058', '059'];

    constructor(
        public imgPathService: ImgPathService,
        private authService: AuthService,
        private ticketService: TicketService,
    ) {}

    ngOnInit() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
    }

    public get formGroup() {
        return this.ticketService.userInfo;
    }

    public goToTermsAndConditions() {
        window.open('/terms-and-conditions', '_blank');
    }

    public async onSubmit() {
        const mobile = this.formGroup.get('phonePrefix').value + this.formGroup.get('phone').value;
        await this.authService.authorizeWithOTP(mobile);
    }

    public get isFormValid() {
        return (
            this.formGroup.get('firstName').valid &&
            this.formGroup.get('lastName').valid &&
            this.formGroup.get('phonePrefix').valid &&
            this.formGroup.get('phone').valid &&
            this.formGroup.get('tncAgreement').valid
        );
    }

    ngOnDestroy() {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }
}
