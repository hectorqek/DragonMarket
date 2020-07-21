import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable ,  BehaviorSubject } from 'rxjs';
import { GLOBAL } from './global';
import { ItemVenta } from '../model/ItemVenta';
import { PersonaBilletera } from '../model/PersonaBilletera';
import { map } from 'rxjs/operators';

@Injectable()
export class PersonaBilleteraService {
  /**
   * Atributos
   */
  public url: string;
  private cliente =  PERSONA;
  private clienteSource = new BehaviorSubject<PersonaBilletera[]>(this.cliente);

  private clienteValido: boolean = false;
  private clienteValidoSource = new BehaviorSubject<boolean>(this.clienteValido);

  /**
   * Creación del observable
   */
  public clienteValido$ = this.clienteValidoSource.asObservable();
  public clienteActual$ = this.clienteSource.asObservable();

  constructor(
    private _http: Http
  ) {
    this.url = GLOBAL.url;

  }
  /**
   * Recibir Persona Billetera
   */
  getBilleteraPersonaId(id: string) {
    return this._http.get(this.url + '/billetera?idCliente=' + id).pipe(map((resultado) => {
      const success  = resultado.json().Success;
       if (success === true  ) {
          let data: PersonaBilletera[] = resultado.json().DataArray;
          return data;
        }
      },
        error => {
          console.log(<any>error);
        }))
    }
  infClienteValidado (cliente) {
      this.clienteSource.next(cliente);
    }
};

const PERSONA: PersonaBilletera[] = [];
