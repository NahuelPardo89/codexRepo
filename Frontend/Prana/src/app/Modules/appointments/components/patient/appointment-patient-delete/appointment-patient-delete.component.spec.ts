import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPatientDeleteComponent } from './appointment-patient-delete.component';

describe('AppointmentPatientDeleteComponent', () => {
  let component: AppointmentPatientDeleteComponent;
  let fixture: ComponentFixture<AppointmentPatientDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentPatientDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentPatientDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
