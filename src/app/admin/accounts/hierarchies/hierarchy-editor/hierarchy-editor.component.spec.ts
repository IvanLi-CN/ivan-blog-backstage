import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyEditorComponent } from './hierarchy-editor.component';

describe('HierarchyEditorComponent', () => {
  let component: HierarchyEditorComponent;
  let fixture: ComponentFixture<HierarchyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
