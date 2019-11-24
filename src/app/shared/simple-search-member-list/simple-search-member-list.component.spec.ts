import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSearchMemberListComponent } from './simple-search-member-list.component';

describe('SimpleSearchMemberListComponent', () => {
  let component: SimpleSearchMemberListComponent;
  let fixture: ComponentFixture<SimpleSearchMemberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleSearchMemberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSearchMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
