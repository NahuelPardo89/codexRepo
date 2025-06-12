import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDoctorCreateComponent } from './insurance-doctor-create.component';

describe('InsuranceDoctorCreateComponent', () => {
  let component: InsuranceDoctorCreateComponent;
  let fixture: ComponentFixture<InsuranceDoctorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDoctorCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceDoctorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
