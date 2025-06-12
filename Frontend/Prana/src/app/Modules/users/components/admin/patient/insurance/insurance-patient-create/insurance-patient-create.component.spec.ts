import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePatientCreateComponent } from './insurance-patient-create.component';

describe('InsurancePatientCreateComponent', () => {
  let component: InsurancePatientCreateComponent;
  let fixture: ComponentFixture<InsurancePatientCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePatientCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePatientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
