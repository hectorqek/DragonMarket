import { Injectable } from '@angular/core';
import { Http } from '../../../node_modules/@angular/http';
import { GLOBAL } from './global';
import { AdalService } from 'adal-angular4';
import { Usuario } from '../model/usuario';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
import { map } from 'rxjs/operators';


@Injectable()
export class UsuarioService {
  public usuario: string ;
  public url: string;

  constructor(private _http: Http, private adalSvc: AdalService) {
    this.url = GLOBAL.url;
   
  }
  getInfoUsuario() {
    console.log('getInfoUsuario: ');
    if(sessionStorage.getItem('Usuario') == null || sessionStorage.getItem('Usuario') == undefined || sessionStorage.getItem('Usuario') == ''){
      sessionStorage.setItem('Usuario', this.adalSvc.userInfo.userName);
    }
    this.usuario = sessionStorage.getItem('Usuario');
    if (this.usuario !== '') {
      let params = 'cliente?' + 'Usuario=' + this.usuario;
      return this._http.get(this.url + params).pipe(map(
        (data) => {
          let response = data.json();
        return response;
        }
      ));
    }
    //  else {
    //     swal('Vuelva iniciar Sesión', 'Por favor vuelve a iniciar sesión', 'error');
    // }

  }
}
