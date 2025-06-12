import { TestBed } from '@angular/core/testing';

import { DoctorprofileService } from './doctorprofile.service';

describe('DoctorprofileService', () => {
  let service: DoctorprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
