import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialityBranchDoctorComponent } from './create-speciality-branch-doctor.component';

describe('CreateSpecialityBranchDoctorComponent', () => {
  let component: CreateSpecialityBranchDoctorComponent;
  let fixture: ComponentFixture<CreateSpecialityBranchDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSpecialityBranchDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpecialityBranchDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
