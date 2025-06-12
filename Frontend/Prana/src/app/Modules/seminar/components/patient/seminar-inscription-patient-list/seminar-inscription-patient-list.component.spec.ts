import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarInscriptionPatientListComponent } from './seminar-inscription-patient-list.component';

describe('SeminarInscriptionPatientListComponent', () => {
  let component: SeminarInscriptionPatientListComponent;
  let fixture: ComponentFixture<SeminarInscriptionPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarInscriptionPatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarInscriptionPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
