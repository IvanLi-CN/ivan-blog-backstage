import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListEditorComponent } from './game-list-editor.component';

describe('GameListEditorComponent', () => {
  let component: GameListEditorComponent;
  let fixture: ComponentFixture<GameListEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
