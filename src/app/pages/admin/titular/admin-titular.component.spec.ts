import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTitularComponent } from './admin-titular.component';

describe('AdminTitularComponent', () => {
  let component: AdminTitularComponent;
  let fixture: ComponentFixture<AdminTitularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTitularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
