import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPatientCreateComponent } from './appointment-patient-create.component';

describe('AppointmentPatientCreateComponent', () => {
  let component: AppointmentPatientCreateComponent;
  let fixture: ComponentFixture<AppointmentPatientCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentPatientCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentPatientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
