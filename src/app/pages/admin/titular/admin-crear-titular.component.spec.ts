import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrearTitularComponent } from './admin-crear-titular.component';

describe('AdminCrearTitularComponent', () => {
  let component: AdminCrearTitularComponent;
  let fixture: ComponentFixture<AdminCrearTitularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCrearTitularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCrearTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
