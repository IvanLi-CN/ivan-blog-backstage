import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOperationButtonComponent } from './table-operation-button.component';

describe('TableOperationButtonComponent', () => {
  let component: TableOperationButtonComponent;
  let fixture: ComponentFixture<TableOperationButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableOperationButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOperationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
