import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformListEditorComponent } from './platform-list-editor.component';

describe('PlatformListEditorComponent', () => {
  let component: PlatformListEditorComponent;
  let fixture: ComponentFixture<PlatformListEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformListEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
