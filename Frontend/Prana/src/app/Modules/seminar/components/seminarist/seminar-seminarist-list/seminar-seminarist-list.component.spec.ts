import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarSeminaristListComponent } from './seminar-seminarist-list.component';

describe('SeminarSeminaristListComponent', () => {
  let component: SeminarSeminaristListComponent;
  let fixture: ComponentFixture<SeminarSeminaristListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarSeminaristListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarSeminaristListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
