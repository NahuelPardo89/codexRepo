import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInsurancePatientComponent } from './edit-insurance-patient.component';

describe('EditInsurancePatientComponent', () => {
  let component: EditInsurancePatientComponent;
  let fixture: ComponentFixture<EditInsurancePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInsurancePatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInsurancePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
