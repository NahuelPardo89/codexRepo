import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialityBranchComponent } from './edit-speciality-branch.component';

describe('EditSpecialityBranchComponent', () => {
  let component: EditSpecialityBranchComponent;
  let fixture: ComponentFixture<EditSpecialityBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSpecialityBranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecialityBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
