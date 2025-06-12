import { TestBed } from '@angular/core/testing';

import { InsurancePatientService } from './insurance-patient.service';

describe('InsurancePatientService', () => {
  let service: InsurancePatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsurancePatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
