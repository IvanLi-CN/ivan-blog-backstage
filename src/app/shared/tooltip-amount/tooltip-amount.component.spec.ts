import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipAmountComponent } from './tooltip-amount.component';

describe('TooltipAmountComponent', () => {
  let component: TooltipAmountComponent;
  let fixture: ComponentFixture<TooltipAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
