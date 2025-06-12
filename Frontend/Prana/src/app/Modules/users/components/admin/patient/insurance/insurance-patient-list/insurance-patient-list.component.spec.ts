import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePatientListComponent } from './insurance-patient-list.component';

describe('InsurancePatientListComponent', () => {
  let component: InsurancePatientListComponent;
  let fixture: ComponentFixture<InsurancePatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
