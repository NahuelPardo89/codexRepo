import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarInscriptionAdminUpdateComponent } from './seminar-inscription-admin-update.component';

describe('SeminarInscriptionAdminUpdateComponent', () => {
  let component: SeminarInscriptionAdminUpdateComponent;
  let fixture: ComponentFixture<SeminarInscriptionAdminUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarInscriptionAdminUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarInscriptionAdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
