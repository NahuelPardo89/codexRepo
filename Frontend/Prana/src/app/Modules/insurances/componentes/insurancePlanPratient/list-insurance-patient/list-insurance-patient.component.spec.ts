import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInsurancePatientComponent } from './list-insurance-patient.component';

describe('ListInsurancePatientComponent', () => {
  let component: ListInsurancePatientComponent;
  let fixture: ComponentFixture<ListInsurancePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInsurancePatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInsurancePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
