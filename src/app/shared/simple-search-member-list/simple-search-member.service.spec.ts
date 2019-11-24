import { TestBed } from '@angular/core/testing';

import { SimpleSearchMemberService } from './simple-search-member.service';

describe('SimpleSearchMemberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimpleSearchMemberService = TestBed.get(SimpleSearchMemberService);
    expect(service).toBeTruthy();
  });
});
