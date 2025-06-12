import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInsuranceDoctorUserComponent } from './create-insurance-doctor-user.component';

describe('CreateInsuranceDoctorUserComponent', () => {
  let component: CreateInsuranceDoctorUserComponent;
  let fixture: ComponentFixture<CreateInsuranceDoctorUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInsuranceDoctorUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInsuranceDoctorUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
