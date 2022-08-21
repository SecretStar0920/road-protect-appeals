import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import isDevelopment from '../helpers/is-development';

@Injectable({
    providedIn: 'root',
})
export class UserInfoGuard implements CanActivate {
    constructor(private router: Router) {}

    checkIfTokenExist() {
        const isStored = localStorage.getItem('pics');
        if (isStored || isDevelopment) {
            return of(true);
        }
        this.router.navigate(['appeal/pics']);
        return of(false);
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.checkIfTokenExist();
    }
}
