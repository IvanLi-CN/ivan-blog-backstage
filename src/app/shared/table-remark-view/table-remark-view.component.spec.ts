import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRemarkViewComponent } from './table-remark-view.component';

describe('TableRemarkViewComponent', () => {
  let component: TableRemarkViewComponent;
  let fixture: ComponentFixture<TableRemarkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRemarkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRemarkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
