import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableImagePreviewComponent} from './table-image-preview.component';

describe('SmallImagePreviewComponent', () => {
  let component: TableImagePreviewComponent;
  let fixture: ComponentFixture<TableImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
