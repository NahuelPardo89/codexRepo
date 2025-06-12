import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAdminUpdateComponent } from './room-admin-update.component';

describe('RoomAdminUpdateComponent', () => {
  let component: RoomAdminUpdateComponent;
  let fixture: ComponentFixture<RoomAdminUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomAdminUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
