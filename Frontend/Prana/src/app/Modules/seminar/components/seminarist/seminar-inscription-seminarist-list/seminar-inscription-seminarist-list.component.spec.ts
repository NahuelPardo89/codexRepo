import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarInscriptionSeminaristListComponent } from './seminar-inscription-seminarist-list.component';

describe('SeminarInscriptionSeminaristListComponent', () => {
  let component: SeminarInscriptionSeminaristListComponent;
  let fixture: ComponentFixture<SeminarInscriptionSeminaristListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarInscriptionSeminaristListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarInscriptionSeminaristListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
