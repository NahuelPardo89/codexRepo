import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpecialityBranchDoctorComponent } from './list-speciality-branch-doctor.component';

describe('ListSpecialityBranchDoctorComponent', () => {
  let component: ListSpecialityBranchDoctorComponent;
  let fixture: ComponentFixture<ListSpecialityBranchDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSpecialityBranchDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSpecialityBranchDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
