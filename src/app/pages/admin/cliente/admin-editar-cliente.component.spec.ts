import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditarClienteComponent } from './admin-editar-cliente.component';

describe('AdminEditarClienteComponent', () => {
  let component: AdminEditarClienteComponent;
  let fixture: ComponentFixture<AdminEditarClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditarClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
