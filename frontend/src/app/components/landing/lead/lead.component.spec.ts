import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LeadComponent } from './lead.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketService } from '../../../core/services/ticket.service';

describe('LeadComponent', () => {
    let component: LeadComponent;
    let fixture: ComponentFixture<LeadComponent>;
    let ticketService: TicketService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeadComponent],
            providers: [TicketService],
            imports: [
                AngularSvgIconModule,
                FormsModule,
                ReactiveFormsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                NoopAnimationsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeadComponent);
        component = fixture.componentInstance;
        ticketService = TestBed.get(TicketService);
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('isFormValid', () => {
        it('should NOT be valid userInfo form is empty', () => {
            expect(component.isFormValid).toBeFalsy();
        });

        it('should NOT be valid if entered English characters', inject(
            [TicketService],
            (ticketService: TicketService) => {
                ticketService.userInfo.get('firstName').patchValue('test');
                ticketService.userInfo.get('lastName').patchValue('test');
                ticketService.userInfo.get('phonePrefix').patchValue('050');
                ticketService.userInfo.get('phone').patchValue('0000000');
                ticketService.userInfo.get('tncAgreement').patchValue(true);
                ticketService.userInfo.get('allowMarketingContent').patchValue(true);
                expect(component.isFormValid).toBeFalsy();
            },
        ));

        it('should be valid if the form was filled with Heb characters', inject(
            [TicketService],
            (ticketService: TicketService) => {
                ticketService.userInfo.get('firstName').patchValue('בדיקה');
                ticketService.userInfo.get('lastName').patchValue('בדיקה');
                ticketService.userInfo.get('phonePrefix').patchValue('050');
                ticketService.userInfo.get('phone').patchValue('0000000');
                ticketService.userInfo.get('tncAgreement').patchValue(true);
                ticketService.userInfo.get('allowMarketingContent').patchValue(true);
                expect(component.isFormValid).toBeTruthy();
            },
        ));
    });
});
