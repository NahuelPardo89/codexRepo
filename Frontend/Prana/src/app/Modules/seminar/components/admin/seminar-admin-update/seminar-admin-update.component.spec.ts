import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarAdminUpdateComponent } from './seminar-admin-update.component';

describe('SeminarAdminUpdateComponent', () => {
  let component: SeminarAdminUpdateComponent;
  let fixture: ComponentFixture<SeminarAdminUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarAdminUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarAdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
