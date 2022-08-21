import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '../../../core/shared.module';
import { PricingComponent } from './pricing.component';

@NgModule({
    declarations: [PricingComponent],
    imports: [CommonModule, SharedModule, MatProgressBarModule],
})
export class PricingModule {}
