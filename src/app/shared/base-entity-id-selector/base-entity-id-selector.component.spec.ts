import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseEntityIdSelectorComponent } from './base-entity-id-selector.component';

describe('BaseEntityIdSelectorComponent', () => {
  let component: BaseEntityIdSelectorComponent;
  let fixture: ComponentFixture<BaseEntityIdSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseEntityIdSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseEntityIdSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
