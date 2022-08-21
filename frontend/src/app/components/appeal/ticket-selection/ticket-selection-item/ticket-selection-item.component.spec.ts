import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSelectionItemComponent } from './ticket-selection-item.component';

describe('TicketSelectionItemComponent', () => {
  let component: TicketSelectionItemComponent;
  let fixture: ComponentFixture<TicketSelectionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSelectionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSelectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
