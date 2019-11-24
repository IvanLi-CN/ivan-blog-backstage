import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBlacklistEditorComponent } from './member-blacklist-editor.component';

describe('MemberBlacklistEditorComponent', () => {
  let component: MemberBlacklistEditorComponent;
  let fixture: ComponentFixture<MemberBlacklistEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberBlacklistEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberBlacklistEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
