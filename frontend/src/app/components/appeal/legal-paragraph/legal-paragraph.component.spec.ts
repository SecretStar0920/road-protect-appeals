import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalParagraphComponent } from './legal-paragraph.component';

describe('LegalParagraphComponent', () => {
    let component: LegalParagraphComponent;
    let fixture: ComponentFixture<LegalParagraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LegalParagraphComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LegalParagraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
