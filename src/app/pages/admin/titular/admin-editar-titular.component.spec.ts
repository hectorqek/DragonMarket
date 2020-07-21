import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditarTitularComponent } from './admin-editar-titular.component';

describe('AdminEditarTitularComponent', () => {
  let component: AdminEditarTitularComponent;
  let fixture: ComponentFixture<AdminEditarTitularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditarTitularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditarTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
