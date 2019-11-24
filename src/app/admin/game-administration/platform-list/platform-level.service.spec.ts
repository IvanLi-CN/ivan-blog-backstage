import { TestBed } from '@angular/core/testing';

import { PlatformLevelService } from './platform-level.service';

describe('PlatformLevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformLevelService = TestBed.get(PlatformLevelService);
    expect(service).toBeTruthy();
  });
});
