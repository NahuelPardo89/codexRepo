import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInsuranceDoctorUserComponent } from './edit-insurance-doctor-user.component';

describe('EditInsuranceDoctorUserComponent', () => {
  let component: EditInsuranceDoctorUserComponent;
  let fixture: ComponentFixture<EditInsuranceDoctorUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInsuranceDoctorUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInsuranceDoctorUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
