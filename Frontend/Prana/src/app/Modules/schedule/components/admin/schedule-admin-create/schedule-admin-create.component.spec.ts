import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAdminCreateComponent } from './schedule-admin-create.component';

describe('ScheduleAdminCreateComponent', () => {
  let component: ScheduleAdminCreateComponent;
  let fixture: ComponentFixture<ScheduleAdminCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAdminCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAdminCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
