import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEspecialityComponent } from './edit-especiality.component';

describe('EditEspecialityComponent', () => {
  let component: EditEspecialityComponent;
  let fixture: ComponentFixture<EditEspecialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEspecialityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEspecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
