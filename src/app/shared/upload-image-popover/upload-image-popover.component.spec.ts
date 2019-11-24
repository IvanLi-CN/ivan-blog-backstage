import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImagePopoverComponent } from './upload-image-popover.component';

describe('UploadImagePopoverComponent', () => {
  let component: UploadImagePopoverComponent;
  let fixture: ComponentFixture<UploadImagePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImagePopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImagePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
