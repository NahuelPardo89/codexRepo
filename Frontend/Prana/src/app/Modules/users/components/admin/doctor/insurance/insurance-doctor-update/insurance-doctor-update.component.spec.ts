import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDoctorUpdateComponent } from './insurance-doctor-update.component';

describe('InsuranceDoctorUpdateComponent', () => {
  let component: InsuranceDoctorUpdateComponent;
  let fixture: ComponentFixture<InsuranceDoctorUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDoctorUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceDoctorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
