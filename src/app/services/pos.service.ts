import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Http } from '../../../node_modules/@angular/http';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { InformacionPOS } from '../model/pos';
import { GestionErrores } from '../lista-errores'
const swal: SweetAlert = _swal as any;
import { map } from 'rxjs/operators';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { Errores } from 'app/model/error';

@Injectable()
export class PosService {
  /* Atributos Generales */
  public  url: string;
  /* Consulta el idPOS que esta configurado localmente en una maquina */
  public  idPOS: number;
  public  usuario: string = sessionStorage.getItem('Usuario');
  public  infoPOS: InformacionPOS;
  private infoPOSSource = new BehaviorSubject<InformacionPOS>(this.infoPOS);
  public  infoPOSService$ = this.infoPOSSource.asObservable();

  /* Métodos */

  constructor(  private _http: Http, private router: Router) {
    this.url = GLOBAL.url;
    this.idPOS = Number(localStorage.getItem('idPOS'));
  }
  estadoPOS() {
    this.idPOS = Number(localStorage.getItem('idPOS'));
    let params: string = 'pos?' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map( (data) => {
      let listadoPOSestados = data.json();
      let infoPOS: InformacionPOS;
      for (let i = 0; i < listadoPOSestados.length; i++  ) {
        if ( listadoPOSestados[i].IdPos === this.idPOS) {
          if ( listadoPOSestados[i].Estado === 'ABIERTO') {
            infoPOS = new InformacionPOS (
              listadoPOSestados[i].IdPos,
              listadoPOSestados[i].NombrePos,
              listadoPOSestados[i].FechaInicio,
              listadoPOSestados[i].FechaFin,
              listadoPOSestados[i].Estado,
              true,
              listadoPOSestados[i].IdPeriodoTrabajo,
              listadoPOSestados[i].IdMenu,
              listadoPOSestados[i].NombreMenu,
              listadoPOSestados[i].IdConsecutivo )
            /* Si es el POS esta abierto se envia una bandera con valor verdadero */
          } else if ( listadoPOSestados[i].Estado === 'CERRADO') {
            infoPOS = new InformacionPOS (
              listadoPOSestados[i].IdPos,
              listadoPOSestados[i].NombrePos,
              listadoPOSestados[i].FechaInicio,
              listadoPOSestados[i].FechaFin,
              listadoPOSestados[i].Estado,
              false,
              listadoPOSestados[i].IdPeriodoTrabajo,
              listadoPOSestados[i].IdMenu,
              listadoPOSestados[i].NombreMenu,
              listadoPOSestados[i].IdConsecutivo )
          }
        }
      }
      this.infoPOS = infoPOS;
      this.infoPOSSource.next (infoPOS);
      return infoPOS;
    }))
  }
  abrirPOS(idMenu) {
    let idPOS = Number(localStorage.getItem('idPOS'));
    let params: string = 'kiosco?' + 'idPos=' + idPOS  + '&' + 'IdMenu=' + idMenu + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      let error: Errores;
      error = new Errores(response[0].CodigoError, response[0].IdTransaccion);
      let tmp: any[] = [];
      tmp.push(error);
      let listadoErrores: any[]  = [];
      for (let i = 0; i < tmp.length; i++) {
        let tmp2: any[] = [];
        tmp2.push(tmp[i].CodigoError);
        tmp2.push(tmp[i].IdTransaccion);
        listadoErrores.push(tmp2);
      }
      if (error.CodigoError === 'P0000') {
        this.estadoPOS();
        this.router.navigate(['/pos/seleccionar-cliente']);
      }
      let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Abrir POS');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return response;
      },
      error => {
        console.error('Error al Abri POS');
      }))
  }
  cerrarPOS(idPeriodoTrabajo) {
    // tslint:disable-next-line:max-line-length
    let params: string = 'kiosco?' + 'idPeriodoTrabajo=' + idPeriodoTrabajo  + '&' + 'IdPOS=' + this.idPOS + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      if (response.length >= 1 ) {
        if (response[0].Descripcion === 'CERRADO') {
          swal('POS Cerrado', 'Se cerró el periodo de Trabajo Exitosamente', 'success');
          this.router.navigate(['/pos/cierre-periodo-trabajo']);
        }
      } else {
        swal('Error', 'Error al intentar cerrar POS', 'error');
      }
      return data.json();
    }))
  }
  consultarMenu() {
    return this._http.get(this.url + 'menu').pipe(map( (data) => {
      let response = data.json();
      return response;
    }))
  }
  estadosPOS() {
    let params: string = 'pos?' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map( (data) => {
      let listadoPOSestados = data.json();
      return listadoPOSestados;
    }))
  }
  listadoPOS() {
    let params: string = 'POS';
    return this._http.get(this.url + params).pipe(map( (data) => {
      let listadoPOS = data.json();
      return listadoPOS.DataArray;
    }))
  }

  historialventas() {
    // tslint:disable-next-line:max-line-length
    let params: string = 'pos?' + 'IdPos=' + this.idPOS + '&' + 'IdCliente=' + null + '&' + 'IdTransaccion=' + null+ '&' + 'Usuario= ' + this.usuario;
    return this._http.get(this.url + params).pipe(map( (data) => {
    let response = data.json();
      return response;
      }));
    }
  historialventasUsuario(IdCliente) {
    // tslint:disable-next-line:max-line-length
    let params: string = 'pos?' + 'IdPos=' + this.idPOS + '&' + 'IdCliente=' + IdCliente + '&' + 'IdTransaccion=' + null + '&' + 'Usuario= ' + this.usuario;
    return this._http.get(this.url + params).pipe(map( (data) => {
    let response = data.json();
      return response;
      }));
  }
  /* Método que hace la reversión para una compra realizada */
  reversionVenta (IdTransaccion) {
    let params: string = 'pos?' + 'IdTransaccionReversar=' + IdTransaccion + '&' + 'IdPos=' + this.idPOS + '&' + 'Usuario=' + this.usuario ;
    return this._http.put(this.url + params, null).pipe(map( (data) => {
    let response = data.json();
    if (response[0].CodigoError === 'RV0000'){
      let labelError = GestionErrores.getError(response[0].CodigoError);
      let iconError = GestionErrores.getIconError(response[0].CodigoError);
      swal('Resultado', labelError , iconError);
    } else if (response[0].CodigoError === 'RV0001') {
      let labelError = GestionErrores.getError(response[0].CodigoError);
      let iconError = GestionErrores.getIconError(response[0].CodigoError);
      swal('Resultado', labelError , iconError);
    } else if (response[0].CodigoError.charAt(0) === 'R' && response[0].CodigoError.charAt(1) === 'V') {
      let labelError = GestionErrores.getError(response[0].CodigoError);
      swal('Resultado', labelError , 'error');
    }
    return data;
    }));
  }
  tirillaCierre(idPeriodoTrabajo, idConsecutivo) {
    // tslint:disable-next-line:max-line-length
    let params: string = 'pos?' + 'IdConsecutivo=' + idConsecutivo + '&' + 'IdPeriodoTrabajo=' + idPeriodoTrabajo + '&' + 'IdPOS=' +  this.idPOS + '&' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map( (data) => {
    let response = data.json();
    return response;
    }));
  }
}
