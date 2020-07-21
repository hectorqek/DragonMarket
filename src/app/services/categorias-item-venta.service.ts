import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Http } from '@angular/http';
import { map, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
export interface Person {
  id: string;
  isActive: boolean;
  age: number;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  disabled?: boolean;
}

@Injectable()
export class CategoriasItemVentaService {

  public url: string;
  /**
  * Metódos
  */
 constructor(
  private _http: Http
  ) {
  this.url = GLOBAL.url;
  }
/**
 * Recibir los productos del Backend
 */
  getcategoriasItemVentaBackend() {
    return this._http.get(this.url + '/categoria').pipe(map((resultado) => {
      let data  = resultado.json().DataArray;
      return data;
    }));
  }
}
