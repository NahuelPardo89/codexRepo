import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePatientEditComponent } from './insurance-patient-edit.component';

describe('InsurancePatientEditComponent', () => {
  let component: InsurancePatientEditComponent;
  let fixture: ComponentFixture<InsurancePatientEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePatientEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePatientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
