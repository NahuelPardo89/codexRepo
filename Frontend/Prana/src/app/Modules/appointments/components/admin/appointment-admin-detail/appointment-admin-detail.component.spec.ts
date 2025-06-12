import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAdminDetailComponent } from './appointment-admin-detail.component';

describe('AppointmentAdminDetailComponent', () => {
  let component: AppointmentAdminDetailComponent;
  let fixture: ComponentFixture<AppointmentAdminDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentAdminDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentAdminDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
