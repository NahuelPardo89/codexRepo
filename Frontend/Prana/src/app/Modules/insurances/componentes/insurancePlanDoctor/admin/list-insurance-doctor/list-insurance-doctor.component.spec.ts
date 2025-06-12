import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInsuranceDoctorComponent } from './list-insurance-doctor.component';

describe('ListInsuranceDoctorComponent', () => {
  let component: ListInsuranceDoctorComponent;
  let fixture: ComponentFixture<ListInsuranceDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInsuranceDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInsuranceDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
