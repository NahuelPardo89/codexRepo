import { TestBed } from '@angular/core/testing';

import { InsuranceDoctorService } from './insurance-doctor.service';

describe('InsuranceDoctorService', () => {
  let service: InsuranceDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
