import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarPatientListComponent } from './seminar-patient-list.component';

describe('SeminarPatientListComponent', () => {
  let component: SeminarPatientListComponent;
  let fixture: ComponentFixture<SeminarPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarPatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
