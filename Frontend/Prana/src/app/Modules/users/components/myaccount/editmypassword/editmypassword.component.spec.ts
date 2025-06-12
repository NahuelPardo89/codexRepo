import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmypasswordComponent } from './editmypassword.component';

describe('EditmypasswordComponent', () => {
  let component: EditmypasswordComponent;
  let fixture: ComponentFixture<EditmypasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmypasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmypasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
