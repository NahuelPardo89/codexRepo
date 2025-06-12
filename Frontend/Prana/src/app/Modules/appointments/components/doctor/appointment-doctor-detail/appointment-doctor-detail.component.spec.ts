import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDoctorDetailComponent } from './appointment-doctor-detail.component';

describe('AppointmentDoctorDetailComponent', () => {
  let component: AppointmentDoctorDetailComponent;
  let fixture: ComponentFixture<AppointmentDoctorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDoctorDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDoctorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
