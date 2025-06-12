import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDoctorDeleteComponent } from './appointment-doctor-delete.component';

describe('AppointmentDoctorDeleteComponent', () => {
  let component: AppointmentDoctorDeleteComponent;
  let fixture: ComponentFixture<AppointmentDoctorDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDoctorDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDoctorDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
