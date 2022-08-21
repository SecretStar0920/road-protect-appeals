import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import isDevelopment from '../helpers/is-development';

@Injectable({
    providedIn: 'root',
})
export class FineDetailsGuard implements CanActivate {
    constructor(private router: Router) {}

    checkIfTokenExist() {
        const x = localStorage.getItem('userInfo');
        if (x || isDevelopment) {
            return of(true);
        }
        this.router.navigate(['start']);
        return of(false);
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.checkIfTokenExist();
    }
}
