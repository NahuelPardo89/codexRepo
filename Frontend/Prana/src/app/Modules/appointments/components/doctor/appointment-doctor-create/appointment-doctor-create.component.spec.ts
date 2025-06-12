import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDoctorCreateComponent } from './appointment-doctor-create.component';

describe('AppointmentDoctorCreateComponent', () => {
  let component: AppointmentDoctorCreateComponent;
  let fixture: ComponentFixture<AppointmentDoctorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDoctorCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDoctorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
