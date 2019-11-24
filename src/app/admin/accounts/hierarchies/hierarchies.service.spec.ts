import { TestBed } from '@angular/core/testing';

import { HierarchiesService } from './hierarchies.service';

describe('HierarchiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HierarchiesService = TestBed.get(HierarchiesService);
    expect(service).toBeTruthy();
  });
});
