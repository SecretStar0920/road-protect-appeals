import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ImgPathService } from '../../core/services/img-path.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    public intro = false;
    public opened = false;

    constructor(
        public readonly imgPathService: ImgPathService,
        public readonly authService: AuthService,
        private readonly router: Router,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.intro = this.router.url.includes('/welcome');
            }
        });
    }

    public toggleBurger() {
        this.opened = !this.opened;
    }

    logout() {
        this.authService.logout();
    }
}
