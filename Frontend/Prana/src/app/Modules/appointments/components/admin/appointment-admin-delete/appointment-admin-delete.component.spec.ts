import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAdminDeleteComponent } from './appointment-admin-delete.component';

describe('AppointmentAdminDeleteComponent', () => {
  let component: AppointmentAdminDeleteComponent;
  let fixture: ComponentFixture<AppointmentAdminDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentAdminDeleteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentAdminDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
