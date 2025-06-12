import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialityBranchComponent } from './create-speciality-branch.component';

describe('CreateSpecialityBranchComponent', () => {
  let component: CreateSpecialityBranchComponent;
  let fixture: ComponentFixture<CreateSpecialityBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSpecialityBranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpecialityBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
