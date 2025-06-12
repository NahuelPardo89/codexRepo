import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAdminUpdateComponent } from './appointment-admin-update.component';

describe('AppointmentAdminUpdateComponent', () => {
  let component: AppointmentAdminUpdateComponent;
  let fixture: ComponentFixture<AppointmentAdminUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentAdminUpdateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentAdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
