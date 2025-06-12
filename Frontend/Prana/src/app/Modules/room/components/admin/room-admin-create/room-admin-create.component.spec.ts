import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAdminCreateComponent } from './room-admin-create.component';

describe('RoomAdminCreateComponent', () => {
  let component: RoomAdminCreateComponent;
  let fixture: ComponentFixture<RoomAdminCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomAdminCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAdminCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
