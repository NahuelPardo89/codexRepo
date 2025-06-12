import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarInscriptionAdminListComponent } from './seminar-inscription-admin-list.component';

describe('SeminarInscriptionAdminListComponent', () => {
  let component: SeminarInscriptionAdminListComponent;
  let fixture: ComponentFixture<SeminarInscriptionAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeminarInscriptionAdminListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeminarInscriptionAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
