import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealFlowWrapperComponent } from './appeal-flow-wrapper.component';

describe('AppealFlowWrapperComponent', () => {
    let component: AppealFlowWrapperComponent;
    let fixture: ComponentFixture<AppealFlowWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppealFlowWrapperComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppealFlowWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
