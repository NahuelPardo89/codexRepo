import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPatientUpdateComponent } from './appointment-patient-update.component';

describe('AppointmentPatientUpdateComponent', () => {
  let component: AppointmentPatientUpdateComponent;
  let fixture: ComponentFixture<AppointmentPatientUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentPatientUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentPatientUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
