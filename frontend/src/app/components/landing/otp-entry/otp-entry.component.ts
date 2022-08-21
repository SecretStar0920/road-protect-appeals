import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TicketService } from 'src/app/core/services/ticket.service';

@Component({
    selector: 'app-otp-entry',
    templateUrl: './otp-entry.component.html',
    styleUrls: ['./otp-entry.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: { class: 'column-grow' },
})
export class OtpEntryComponent {
    public otpCode: string = '';

    constructor(private readonly authService: AuthService, private readonly ticketService: TicketService) {}

    public async onSubmit() {
        await this.authService.authorizeUser(this.otpCode);
    }

    public resendOtpCode() {
        const mobile =
            this.ticketService.userInfo.get('phonePrefix').value + this.ticketService.userInfo.get('phone').value;
        this.authService.authorizeWithOTP(mobile);
    }

    public get mobile(): string {
        const prefix = this.ticketService.userInfo.get('phonePrefix').value;
        const num = this.ticketService.userInfo.get('phone').value;
        return `${prefix}-${num}`;
    }
}
