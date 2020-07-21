import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';
import { UlrAutorizacionACUMEN } from './global';
import { map } from 'rxjs/operators';


@Injectable()
export class AutorizacionService {
  /**
   * Atributos
   */
  public url: string;

  /**
  * Metódos
  */
  constructor(
    private _http: Http
  ) {
    this.url = UlrAutorizacionACUMEN.url;
  }
  /**
   * Recibir los productos del Backend
   */
  getAutorizacionBackend(Usuario: string, Url: string) {
    let urlSite = window.location.origin;
    /*if(Url == "https://dragonmarket.azurewebsites.net/#/pos"){
       Url = "https://dragonmarket.azurewebsites.net/pos";
    }
    if(Url == "https://dragonmarketuat.azurewebsites.net/#/pos"){
       Url = "https://dragonmarketuat.azurewebsites.net/pos";
    }
     if(Url == "https://dragonmarket.azurewebsites.net/#/inventario"){
       Url = "https://dragonmarket.azurewebsites.net/inventario";
    }
    if(Url == "https://dragonmarketuat.azurewebsites.net/#/inventario"){
       Url = "https://dragonmarketuat.azurewebsites.net/inventario";
    }*/
    if (Url === urlSite + '/#/inventario') {
      Url = urlSite + '/inventario';
    }
    if (Url === urlSite + '/#/pos') {
      Url = urlSite + '/pos';
    }
    if (Url === urlSite + '/#/recargasRecargarBTN'){
      Url = urlSite + '/recargasRecargarBTN';
    }
    return this._http.get(this.url + '/autorizacion?Usuario=' + Usuario + '&Url=' + Url).pipe(map((resultado) => {
      const data  = resultado.json();
      return data;
    }));
  }

};

