import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaTitularComponent } from './admin-lista-titular.component';

describe('AdminListaTitularComponent', () => {
  let component: AdminListaTitularComponent;
  let fixture: ComponentFixture<AdminListaTitularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaTitularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
