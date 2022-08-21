import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '../../../core/shared.module';
import { AboutOurAppComponent } from './about-our-app/about-our-app.component';
import { AboutOurPartnersComponent } from './about-our-partners/about-our-partners.component';
import { AboutUsComponent } from './about-us.component';

@NgModule({
    declarations: [AboutUsComponent, AboutOurAppComponent, AboutOurPartnersComponent],
    imports: [CommonModule, SharedModule, MatProgressBarModule],
})
export class AboutUsModule {}
