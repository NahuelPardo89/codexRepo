import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarAdminCreateComponent } from './seminar-admin-create.component';

describe('SeminarAdminCreateComponent', () => {
  let component: SeminarAdminCreateComponent;
  let fixture: ComponentFixture<SeminarAdminCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarAdminCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarAdminCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
