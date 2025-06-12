import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInsuranceDoctorComponent } from './create-insurance-doctor.component';

describe('CreateInsuranceDoctorComponent', () => {
  let component: CreateInsuranceDoctorComponent;
  let fixture: ComponentFixture<CreateInsuranceDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInsuranceDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInsuranceDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
