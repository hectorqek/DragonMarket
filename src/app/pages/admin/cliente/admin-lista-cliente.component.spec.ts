import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaClienteComponent } from './admin-lista-cliente.component';

describe('AdminListaClienteComponent', () => {
  let component: AdminListaClienteComponent;
  let fixture: ComponentFixture<AdminListaClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
