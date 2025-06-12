import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarInscriptionAdminCreateComponent } from './seminar-inscription-admin-create.component';

describe('SeminarInscriptionAdminCreateComponent', () => {
  let component: SeminarInscriptionAdminCreateComponent;
  let fixture: ComponentFixture<SeminarInscriptionAdminCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarInscriptionAdminCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarInscriptionAdminCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
