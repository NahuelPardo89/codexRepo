import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPatientDetailComponent } from './appointment-patient-detail.component';

describe('AppointmentPatientDetailComponent', () => {
  let component: AppointmentPatientDetailComponent;
  let fixture: ComponentFixture<AppointmentPatientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentPatientDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentPatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
