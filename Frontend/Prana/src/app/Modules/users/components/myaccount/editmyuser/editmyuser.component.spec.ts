import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmyuserComponent } from './editmyuser.component';

describe('EditmyuserComponent', () => {
  let component: EditmyuserComponent;
  let fixture: ComponentFixture<EditmyuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmyuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
