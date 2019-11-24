import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTypeEditorComponent } from './game-type-editor.component';

describe('GameTypeEditorComponent', () => {
  let component: GameTypeEditorComponent;
  let fixture: ComponentFixture<GameTypeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTypeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTypeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
