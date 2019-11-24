import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SmallImagePreviewComponent} from './small-image-preview.component';

describe('SmallImagePreviewComponent', () => {
  let component: SmallImagePreviewComponent;
  let fixture: ComponentFixture<SmallImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmallImagePreviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
