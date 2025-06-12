import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInsuranceDoctorComponent } from './edit-insurance-doctor.component';

describe('EditInsuranceDoctorComponent', () => {
  let component: EditInsuranceDoctorComponent;
  let fixture: ComponentFixture<EditInsuranceDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInsuranceDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInsuranceDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
