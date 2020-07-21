import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router, Params } from '@angular/router';
import { GLOBAL } from './global';
import { ClienteNotificacionReglas, Reglas, ReglasTransaccion, ClienteReglaConsumo, ReglaConsumoTransaccion } from '../model/cliente';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  public usuario: string;
  public url: string;
  public urlConsultarRol: string;
  public urlConsultarUsuario: string;
  public urlEditarRol: string;
  public urlEliminarRol: string;
  public urlCrearRol: string;

  constructor(private _http: Http, private _router: Router) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
    this.urlConsultarRol = this.url + 'autorizacion';
    this.urlConsultarUsuario = this.url + 'autorizacion';
    this.urlEditarRol = this.url + 'autorizacion/';
    this.urlEliminarRol = this.url + 'autorizacion';
    this.urlCrearRol = this.url + 'autorizacion';
  }

  consultarRol(data?: any) {
    return this._http.get(this.urlConsultarRol + '?Usuario=""').pipe(map((data) => {
      let response = data.json();
      return response;
    }, err => {
      console.log('Service: Error al consultar Roles.');
    }));
  }

  consultarUsuario(idRol: any, email: string, usuario: string) {
    console.log('email', email)
    console.log('idRol', idRol)
    return this._http.get(this.urlConsultarUsuario + '?idRol=' + parseInt(idRol) + '&email=' + email + '&Usuario=' + usuario).pipe(map((data) => {
      let response = data.json();
      return response;
    }, err => {
      console.log('Service: Error al consular roles de Usuario.');
    }));
  }

  editarRol(data?: any) {
    return this._http.post(this.urlEditarRol + '?idRol=' + data.idRol +
      '&emailUsuario=' + data.emailUsuario +
      '&accion=' + data.accion +
      '&Usuario=' + data.Usuario, null).pipe(map((data) => {
        let response = data.json();
        return response;
      }, err => {
        console.log('Service: Error al editar rol de usuario.');
      }));
  }

  eliminarRol(data?: any) {
    return this._http.post(this.urlEliminarRol + '?idRol=' + data.idRol +
    '&emailUsuario=' + data.emailUsuario +
    '&accion=' + data.accion +
    '&Usuario=' + data.Usuario, null).pipe(map((data) => {
      let response = data.json();
      return response;
    }, err => {
      console.log('Service: Error al eliminar rol de usuario.');
    }));
  }

  crearRol(data?: any) {
    return this._http.post(this.urlCrearRol + '?idRol=' + data.idRol +
    '&emailUsuario=' + data.emailUsuario +
    '&accion=' + data.accion +
    '&Usuario=' + data.Usuario, null).pipe(map((data) => {
      let response = data.json();
      return response;
    }, err => {
      console.log('Service: Error al crear rol de usuario.');
    }));
  }

}
