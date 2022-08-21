import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { FRONTEND_ENDPOINTS } from '../../config/frontend-endpoints';
import { TicketService } from '../services/ticket.service';

@Injectable({
    providedIn: 'root',
})
export class CurrentAppealGuard implements CanActivate, CanActivateChild {
    constructor(private ticketService: TicketService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // For now the current appeal must actually be set in the ticket service
        // TODO: Later, this will rather be true if the ticket is found in the store or retrieved from the backend
        const ticketSet = this.ticketService.fine.get('id').value !== -1;

        if (ticketSet) {
            return true;
        }

        this.router.navigate([FRONTEND_ENDPOINTS.appealsHome]);
        return false;
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(next, state);
    }
}
