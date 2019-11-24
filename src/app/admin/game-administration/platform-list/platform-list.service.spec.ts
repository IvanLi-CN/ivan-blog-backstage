import { TestBed } from '@angular/core/testing';

import { PlatformListService } from './platform-list.service';

describe('PlatformListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformListService = TestBed.get(PlatformListService);
    expect(service).toBeTruthy();
  });
});
