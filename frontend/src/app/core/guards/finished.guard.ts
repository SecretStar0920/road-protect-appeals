import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';

@Injectable({
    providedIn: 'root',
})
export class FinishedGuard implements CanActivate {
    constructor(private readonly router: Router, private readonly ticketService: TicketService) {}

    canActivate(): boolean {
        const userInfoFinished = this.ticketService.userInfo.get('finished').value;
        const appealFinished = this.ticketService.fine.get('finished').value;
        if (!userInfoFinished || !appealFinished) {
            this.router.navigate(['/appeal']);
            return false;
        }
        return true;
    }
}
