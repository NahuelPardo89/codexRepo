import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminaristListComponent } from './seminarist-list.component';

describe('SeminaristListComponent', () => {
  let component: SeminaristListComponent;
  let fixture: ComponentFixture<SeminaristListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminaristListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminaristListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
