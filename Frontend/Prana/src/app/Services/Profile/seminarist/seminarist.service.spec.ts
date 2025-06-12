import { TestBed } from '@angular/core/testing';

import { SeminaristService } from './seminarist.service';

describe('SeminaristService', () => {
  let service: SeminaristService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeminaristService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
