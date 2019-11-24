import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumPreviewComponent } from './enum-preview.component';

describe('EnumPerviewComponent', () => {
  let component: EnumPreviewComponent;
  let fixture: ComponentFixture<EnumPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
