import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { OtpEntryComponent } from './otp-entry.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/core/services/auth.service';

describe('OtpEntryComponent', () => {
    let component: OtpEntryComponent;
    let fixture: ComponentFixture<OtpEntryComponent>;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OtpEntryComponent],
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
        fixture = TestBed.createComponent(OtpEntryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        authService = TestBed.get(AuthService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('resendOtpCode', () => {
        it('should send new otp code if clicked', () => {
            const resendButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector(
                '.btn-link.btn-link--bold',
            );
            spyOn(component, 'resendOtpCode');
            resendButton.click();
            expect(component.resendOtpCode).toHaveBeenCalled();
        });
    });
});
