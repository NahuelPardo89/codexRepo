import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorReportListComponent } from './doctor-report-list.component';

describe('DoctorReportListComponent', () => {
  let component: DoctorReportListComponent;
  let fixture: ComponentFixture<DoctorReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorReportListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
