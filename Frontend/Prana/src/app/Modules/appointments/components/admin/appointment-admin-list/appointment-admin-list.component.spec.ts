import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAdminListComponent } from './appointment-admin-list.component';

describe('AppointmentAdminListComponent', () => {
  let component: AppointmentAdminListComponent;
  let fixture: ComponentFixture<AppointmentAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentAdminListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
