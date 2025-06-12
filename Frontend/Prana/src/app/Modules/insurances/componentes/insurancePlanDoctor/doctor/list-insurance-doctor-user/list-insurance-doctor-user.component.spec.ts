import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInsuranceDoctorUserComponent } from './list-insurance-doctor-user.component';

describe('ListInsuranceDoctorUserComponent', () => {
  let component: ListInsuranceDoctorUserComponent;
  let fixture: ComponentFixture<ListInsuranceDoctorUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInsuranceDoctorUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInsuranceDoctorUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
