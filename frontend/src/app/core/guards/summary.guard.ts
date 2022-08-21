import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import isDevelopment from '../helpers/is-development';

@Injectable({
    providedIn: 'root',
})
export class SummaryGuard implements CanActivate {
    constructor(private router: Router) {}

    checkIfPartFinished() {
        const isStored = JSON.parse(localStorage.getItem('userInfo'));
        if ((isStored && isStored.finished) || isDevelopment) {
            return of(true);
        }
        this.router.navigate(['appeal/user-info']);
        return of(false);
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.checkIfPartFinished();
    }
}
