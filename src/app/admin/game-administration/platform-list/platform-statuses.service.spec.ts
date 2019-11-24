import { TestBed } from '@angular/core/testing';

import { PlatformStatusesService } from './platform-statuses.service';

describe('PlatformStatusesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformStatusesService = TestBed.get(PlatformStatusesService);
    expect(service).toBeTruthy();
  });
});
