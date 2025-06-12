import { TestBed } from '@angular/core/testing';

import { DoctorscheduleService } from './doctorschedule.service';

describe('DoctorscheduleService', () => {
  let service: DoctorscheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorscheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
