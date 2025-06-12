import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendnewletterComponent } from './sendnewletter.component';

describe('SendnewletterComponent', () => {
  let component: SendnewletterComponent;
  let fixture: ComponentFixture<SendnewletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendnewletterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendnewletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
