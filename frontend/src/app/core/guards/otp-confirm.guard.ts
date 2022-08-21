import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';

@Injectable({
    providedIn: 'root',
})
export class OTPConfirmGuard implements CanActivate {
    constructor(private readonly ticketService: TicketService, private readonly router: Router) {}

    canActivate(): boolean {
        const firstName = this.ticketService.userInfo.get('firstName').value;
        const lastName = this.ticketService.userInfo.get('lastName').value;
        const phonePrefix = this.ticketService.userInfo.get('phonePrefix').value;
        const phone = this.ticketService.userInfo.get('phone').value;
        if (!!firstName && !!lastName && !!phonePrefix && !!phone) {
            return true;
        }
        this.router.navigate(['/welcome']);
        return false;
    }
}
