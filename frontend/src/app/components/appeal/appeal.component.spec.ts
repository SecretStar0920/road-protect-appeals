import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealComponent } from './appeal.component';

describe('AppealComponent', () => {
    let component: AppealComponent;
    let fixture: ComponentFixture<AppealComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppealComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppealComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
