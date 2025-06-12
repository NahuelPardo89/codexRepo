import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminaristCreateComponent } from './seminarist-create.component';

describe('SeminaristCreateComponent', () => {
  let component: SeminaristCreateComponent;
  let fixture: ComponentFixture<SeminaristCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminaristCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminaristCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
