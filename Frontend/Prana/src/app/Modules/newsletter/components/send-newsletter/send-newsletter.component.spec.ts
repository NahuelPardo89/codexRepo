import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNewsletterComponent } from './send-newsletter.component';

describe('SendNewsletterComponent', () => {
  let component: SendNewsletterComponent;
  let fixture: ComponentFixture<SendNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendNewsletterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
