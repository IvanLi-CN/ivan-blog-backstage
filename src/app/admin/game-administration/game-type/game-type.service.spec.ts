import { TestBed } from '@angular/core/testing';

import { GameTypeService } from './game-type.service';

describe('GameTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameTypeService = TestBed.get(GameTypeService);
    expect(service).toBeTruthy();
  });
});
