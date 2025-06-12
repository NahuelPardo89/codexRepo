import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDoctorListComponent } from './appointment-doctor-list.component';

describe('AppointmentDoctorListComponent', () => {
  let component: AppointmentDoctorListComponent;
  let fixture: ComponentFixture<AppointmentDoctorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDoctorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
