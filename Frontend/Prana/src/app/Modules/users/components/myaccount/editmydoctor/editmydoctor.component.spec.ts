import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmydoctorComponent } from './editmydoctor.component';

describe('EditmydoctorComponent', () => {
  let component: EditmydoctorComponent;
  let fixture: ComponentFixture<EditmydoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmydoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmydoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
