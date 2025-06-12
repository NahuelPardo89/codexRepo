import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInsuranceComponent } from './list-insurance.component';

describe('ListInsuranceComponent', () => {
  let component: ListInsuranceComponent;
  let fixture: ComponentFixture<ListInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInsuranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
