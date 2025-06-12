import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmypatientComponent } from './editmypatient.component';

describe('EditmypatientComponent', () => {
  let component: EditmypatientComponent;
  let fixture: ComponentFixture<EditmypatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmypatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmypatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
