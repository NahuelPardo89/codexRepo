import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarAdminListComponent } from './seminar-admin-list.component';

describe('SeminarAdminListComponent', () => {
  let component: SeminarAdminListComponent;
  let fixture: ComponentFixture<SeminarAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarAdminListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeminarAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
