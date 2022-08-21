import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealFlowStepsComponent } from './appeal-flow-steps.component';

describe('AppealFlowStepsComponent', () => {
    let component: AppealFlowStepsComponent;
    let fixture: ComponentFixture<AppealFlowStepsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppealFlowStepsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppealFlowStepsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
