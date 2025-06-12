import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInsurancePatientComponent } from './create-insurance-patient.component';

describe('CreateInsurancePatientComponent', () => {
  let component: CreateInsurancePatientComponent;
  let fixture: ComponentFixture<CreateInsurancePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInsurancePatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInsurancePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
