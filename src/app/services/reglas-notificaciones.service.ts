import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router, Params } from '@angular/router';
import { GLOBAL } from './global';
import { ClienteNotificacionReglas, Reglas, ReglasTransaccion, ClienteReglaConsumo, ReglaConsumoTransaccion } from '../model/cliente';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ReglasNotificacionesService {
  public  usuario: string;
  public  url: string;
  public clienteReglasNotificaciones: ClienteNotificacionReglas;
  public clienteReglaConsumo : ClienteReglaConsumo;
  private productosSource = new BehaviorSubject<ClienteReglaConsumo>(this.clienteReglaConsumo);
  public listaReglasService$ = this.productosSource.asObservable();

  constructor(private _http: Http,  private _router: Router) 
  // tslint:disable-next-line:one-line
  {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
  }
  consultarReglas(){
    let params: string = 'regla?' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map( (data) => {
      this.clienteReglasNotificaciones = data.json();
      return this.clienteReglasNotificaciones;
    }));
  }
  actualizarRegla(IdCliente: string, IdBolsillo: number,  IdRegla: number, MontoItem: number, EstadoRegla: boolean) {
    let reglaActualizada: ReglasTransaccion[] = [];
    let reglaxCliente: ReglasTransaccion;
        reglaxCliente = new ReglasTransaccion(
          IdCliente,
          IdBolsillo,
          IdRegla,
          MontoItem,
          EstadoRegla
          );
    reglaActualizada.push(reglaxCliente);
    let params: string = 'regla?' + 'ReglasClienteDT=' + JSON.stringify(reglaActualizada) + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map( (data) => {
      let response = data.json();
      return response;
    } ))
  }

  /*
  Método: consultarReglaLimitacionConsumo
  Descripción: Consulta la regla de limitación de productos por cliente
  Autor: Héctor Arias
  Fecha: 06/07/2019
   */

  consultarReglaLimitacionConsumo(){
    let params: string = 'regla?' + 'Usuario=' + this.usuario + '&Regla=3';
    return this._http.get(this.url + params).pipe(map( (data) => {
      this.clienteReglaConsumo = data.json();
      this.productosSource.next(this.clienteReglaConsumo);
      return this.clienteReglaConsumo;
    }));
  }

  actualizarReglaLimitacionConsumo(reglaConsumoTransaccion: any) {
    let reglaActualizada: ReglaConsumoTransaccion[] = [];
    let params: string = 'regla?' + 'ReglasClienteDT=' + JSON.stringify(reglaConsumoTransaccion) + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map( (data) => {
      let response = data.json();
      this.consultarReglaLimitacionConsumo().subscribe();
      return response;
    } ))
  }
  eliminarReglaLimitacionConsumo(IdCliente: string, IdBolsillo: number,  IdRegla: number, MontoItem: number, EstadoRegla: boolean, IdItemVenta: number) {
    let reglaActualizada: ReglaConsumoTransaccion[] = [];
    let reglaxCliente: ReglaConsumoTransaccion;
        reglaxCliente = new ReglaConsumoTransaccion(
          IdCliente,
          IdBolsillo,
          IdRegla,
          MontoItem,
          EstadoRegla,
          IdItemVenta,
          null
          );
    reglaActualizada.push(reglaxCliente);
    let params: string = 'regla?' + 'ReglasClienteDT=' + JSON.stringify(reglaActualizada) + '&' + 'Usuario=' + this.usuario + '&' + 'IdRegla=' + IdRegla;
    return this._http.delete(this.url + params, null).pipe(map( (data) => {
      let response = data.json();
      return response;
    } ))
  }

}


