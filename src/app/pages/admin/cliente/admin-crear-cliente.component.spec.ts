import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrearClienteComponent } from './admin-crear-cliente.component';

describe('AdminCrearClienteComponent', () => {
  let component: AdminCrearClienteComponent;
  let fixture: ComponentFixture<AdminCrearClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCrearClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCrearClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
