import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAdminCreateComponent } from './appointment-admin-create.component';

describe('AppointmentAdminCreateComponent', () => {
  let component: AppointmentAdminCreateComponent;
  let fixture: ComponentFixture<AppointmentAdminCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentAdminCreateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentAdminCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
