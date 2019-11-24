import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTextFieldComponent } from './auth-text-field.component';

describe('AuthTextfieldComponent', () => {
  let component: AuthTextFieldComponent;
  let fixture: ComponentFixture<AuthTextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
