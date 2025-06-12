import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAdminListComponent } from './schedule-admin-list.component';

describe('ScheduleAdminListComponent', () => {
  let component: ScheduleAdminListComponent;
  let fixture: ComponentFixture<ScheduleAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAdminListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
