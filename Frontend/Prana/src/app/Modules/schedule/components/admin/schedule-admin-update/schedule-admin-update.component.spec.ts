import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAdminUpdateComponent } from './schedule-admin-update.component';

describe('ScheduleAdminUpdateComponent', () => {
  let component: ScheduleAdminUpdateComponent;
  let fixture: ComponentFixture<ScheduleAdminUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAdminUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
