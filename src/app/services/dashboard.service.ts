import { Injectable } from '@angular/core';
import {Http} from '../../../node_modules/@angular/http';
import { map } from 'rxjs/operators'
import { GLOBAL } from './global';

@Injectable()
export class DashboardService{
  public url: string;
  public usuario: string;
  public parametros:any;
  constructor(private _http: Http) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
   }
  obtenerData(valor:number,tipo:string){
    var usuario='?Usuario=' + sessionStorage.getItem('Usuario')
    if(tipo=='cant'){
        var dashboard='CantDashboard'+usuario+'&param='+valor;
    }
    if(tipo=='trx'){
      var dashboard='TrxDashboard'+usuario;
    }
    return this._http.get(this.url+dashboard).pipe(map((resultado)=>{
      return resultado.json();
    }));          
  }  
}