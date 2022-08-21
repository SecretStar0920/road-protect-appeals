import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import isDevelopment from '../helpers/is-development';

@Injectable({
    providedIn: 'root',
})
export class PicsGuard implements CanActivate {
    constructor(private router: Router) {}

    checkIfPartFinished() {
        const isStored = JSON.parse(localStorage.getItem('appealDetails'));
        if (isStored || isDevelopment) {
            return of(true);
        }
        this.router.navigate(['appeal/details']);
        return of(false);
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.checkIfPartFinished();
    }
}
