import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '../../../core/shared.module';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactUsComponent } from './contact-us.component';

@NgModule({
    declarations: [ContactUsComponent, ContactDetailsComponent, ContactFormComponent],
    imports: [CommonModule, SharedModule, MatProgressBarModule],
})
export class ContactUsModule {}
