import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Http } from '../../../node_modules/@angular/http';
import { Router } from '../../../node_modules/@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
import { Menu, MenuHijos } from '../model/menu';
import { map } from 'rxjs/operators';
import 'rxjs/Rx';

@Injectable()
export class UrlService {
  public url: string;
  public usuario: string;
  public currentURL;
  constructor(private location: Location,
              private _http: Http,
              private _router: Router) {

                this.url = GLOBAL.url;
                this.consultarMenu();
                this.getPath();
  }
  getPath() {
    console.log('getPath: ');
    this.currentURL = this.location.path();
    return this.currentURL;
  }
  consultarMenu() {
    console.log('consultarMenu: ');
    this.usuario = sessionStorage.getItem('Usuario');
    let params: string = 'autorizacion?' + 'Usuario=' + this.usuario + '&' + 'UrlSitio=' + GLOBAL.urlValidacion;
    return this._http.get(this.url + params).pipe(map( (data) => {
    let response: Menu[] = data.json();
    return response;
    }));
  }
  consultarPermisos(url) {
    console.log('consultarPermisos: ');
    let params: string = 'autorizacion?' + 'Usuario=' + this.usuario + '&' + 'Url=' + url;
    return this._http.get(this.url + params).pipe(map( (data) => {
    let  response: any[] = data.json();
    if (response.length === 0 ) {
      this._router.navigate(['/403']);
    } else {
       if (response[0].EstadoPermiso === 0 ) {
        this._router.navigate(['/403']);
       }
    }
    return response;
   }));
  }
  consultaRol(url: any) {
    console.log('consultaRol: ');
    let params: string = 'Autorizacion?' + 'Usuario=' + this.usuario + '&Url=' + GLOBAL.urlValidacion + url ;
    return this._http.get(this.url + params).pipe(map( (data) => {
    let  response = data.json();
    if (response[0].EstadoPermiso === 1) {
    } else {
      swal({
        title: 'Acceso Denegado',
        text: 'Usted No tienes permisos para consultar esta página, por favor comuniquese con Mesa de Ayuda',
        icon: 'error',
        closeOnClickOutside: false,
        buttons: [false],
        timer: 3000,
      });
      this._router.navigate(['/']);
    }
    return response;
    }));
  }
}





