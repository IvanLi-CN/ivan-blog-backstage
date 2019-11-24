import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOperationTextInputModalComponent } from './table-operation-text-input-modal.component';

describe('TableOperationTextInputModalComponent', () => {
  let component: TableOperationTextInputModalComponent;
  let fixture: ComponentFixture<TableOperationTextInputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableOperationTextInputModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOperationTextInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
