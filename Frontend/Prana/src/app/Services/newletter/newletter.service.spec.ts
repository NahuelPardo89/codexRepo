import { TestBed } from '@angular/core/testing';

import { NewletterService } from './newletter.service';

describe('NewletterService', () => {
  let service: NewletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewletterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
