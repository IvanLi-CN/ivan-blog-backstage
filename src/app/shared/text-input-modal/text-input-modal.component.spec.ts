import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputModalComponent } from './text-input-modal.component';

describe('TextInputModalComponent', () => {
  let component: TextInputModalComponent;
  let fixture: ComponentFixture<TextInputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextInputModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
