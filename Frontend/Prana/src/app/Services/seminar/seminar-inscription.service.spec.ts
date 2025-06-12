import { TestBed } from '@angular/core/testing';

import { SeminarInscriptionService } from './seminar-inscription.service';

describe('SeminarInscriptionService', () => {
  let service: SeminarInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeminarInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
