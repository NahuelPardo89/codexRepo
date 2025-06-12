import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateespecialityComponent } from './createespeciality.component';

describe('CreateespecialityComponent', () => {
  let component: CreateespecialityComponent;
  let fixture: ComponentFixture<CreateespecialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateespecialityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateespecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
