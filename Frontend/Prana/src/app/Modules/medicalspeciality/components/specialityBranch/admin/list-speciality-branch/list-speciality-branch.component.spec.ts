import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpecialityBranchComponent } from './list-speciality-branch.component';

describe('ListSpecialityBranchComponent', () => {
  let component: ListSpecialityBranchComponent;
  let fixture: ComponentFixture<ListSpecialityBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSpecialityBranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSpecialityBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
