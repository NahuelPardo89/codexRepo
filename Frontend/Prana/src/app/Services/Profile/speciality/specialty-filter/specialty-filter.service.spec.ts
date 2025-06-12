import { TestBed } from '@angular/core/testing';

import { SpecialtyFilterService } from './specialty-filter.service';

describe('SpecialtyFilterService', () => {
  let service: SpecialtyFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialtyFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
