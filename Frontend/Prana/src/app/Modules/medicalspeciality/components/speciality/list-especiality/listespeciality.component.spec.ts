import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListespecialityComponent } from './listespeciality.component';

describe('ListespecialityComponent', () => {
  let component: ListespecialityComponent;
  let fixture: ComponentFixture<ListespecialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListespecialityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListespecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
