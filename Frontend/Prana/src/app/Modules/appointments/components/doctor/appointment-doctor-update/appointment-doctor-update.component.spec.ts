import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDoctorUpdateComponent } from './appointment-doctor-update.component';

describe('AppointmentDoctorUpdateComponent', () => {
  let component: AppointmentDoctorUpdateComponent;
  let fixture: ComponentFixture<AppointmentDoctorUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDoctorUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDoctorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
