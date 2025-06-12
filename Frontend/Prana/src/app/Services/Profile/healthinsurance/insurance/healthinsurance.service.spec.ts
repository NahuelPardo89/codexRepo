import { TestBed } from '@angular/core/testing';

import { HealthinsuranceService } from './healthinsurance.service';

describe('HealthinsuranceService', () => {
  let service: HealthinsuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthinsuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
