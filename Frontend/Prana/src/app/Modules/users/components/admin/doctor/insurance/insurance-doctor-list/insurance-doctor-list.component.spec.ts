import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDoctorListComponent } from './insurance-doctor-list.component';

describe('InsuranceDoctorListComponent', () => {
  let component: InsuranceDoctorListComponent;
  let fixture: ComponentFixture<InsuranceDoctorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDoctorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceDoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
