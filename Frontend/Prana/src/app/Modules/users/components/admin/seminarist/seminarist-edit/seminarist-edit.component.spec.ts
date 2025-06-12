import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminaristEditComponent } from './seminarist-edit.component';

describe('SeminaristEditComponent', () => {
  let component: SeminaristEditComponent;
  let fixture: ComponentFixture<SeminaristEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminaristEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminaristEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
