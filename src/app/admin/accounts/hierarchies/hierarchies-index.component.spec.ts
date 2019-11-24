import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchiesIndexComponent } from './hierarchies-index.component';

describe('HierarchiesIndexComponent', () => {
  let component: HierarchiesIndexComponent;
  let fixture: ComponentFixture<HierarchiesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchiesIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchiesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
