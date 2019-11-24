import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpOrDownIndicatorComponent } from './up-or-down-indicator.component';

describe('UpOrDownIndicatorComponent', () => {
  let component: UpOrDownIndicatorComponent;
  let fixture: ComponentFixture<UpOrDownIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpOrDownIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpOrDownIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
