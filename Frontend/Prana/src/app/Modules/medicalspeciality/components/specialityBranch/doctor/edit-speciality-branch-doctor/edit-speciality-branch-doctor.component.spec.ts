import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialityBranchDoctorComponent } from './edit-speciality-branch-doctor.component';

describe('EditSpecialityBranchDoctorComponent', () => {
  let component: EditSpecialityBranchDoctorComponent;
  let fixture: ComponentFixture<EditSpecialityBranchDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSpecialityBranchDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecialityBranchDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
