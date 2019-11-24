import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTypeComponent } from './game-type.component';

describe('GameTypeComponent', () => {
  let component: GameTypeComponent;
  let fixture: ComponentFixture<GameTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
