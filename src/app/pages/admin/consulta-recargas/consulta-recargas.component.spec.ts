import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaRecargasComponent } from './consulta-recargas.component';

describe('ConsultaRecargasComponent', () => {
  let component: ConsultaRecargasComponent;
  let fixture: ComponentFixture<ConsultaRecargasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaRecargasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaRecargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
