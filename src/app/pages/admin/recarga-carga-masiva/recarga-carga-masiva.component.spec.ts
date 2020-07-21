import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargaCargaMasivaComponent } from './recarga-carga-masiva.component';

describe('RecargaCargaMasivaComponent', () => {
  let component: RecargaCargaMasivaComponent;
  let fixture: ComponentFixture<RecargaCargaMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecargaCargaMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargaCargaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
