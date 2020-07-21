import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GLOBAL } from './global';
import { PersonaBilletera } from '../model/PersonaBilletera';
import { Venta, ResultadoTransaccion } from '../model/venta';
import { ItemVentaTransaccion } from '../model/ItemVentaTransaccion';
import { map } from 'rxjs/operators';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';

const swal: SweetAlert = _swal as any;

@Injectable()
export class VentaService {

 /**
   * Atributos
   */
  public url: string;
  /**
   * Creación de los Subject para emitir los eventos
   */
  constructor(
    private _http: Http
  ) {
    this.url = GLOBAL.url ;
  }
  /**
   * Enviar Persona Billetera
   */
  enviarCompra(IdPosLocal, venta: ItemVentaTransaccion[], reciboTotal: number, cliente: PersonaBilletera[]) {
    let usuario = sessionStorage.getItem('Usuario');
    let params: any = 'venta?' + 'IdCliente=' + cliente[0].IdCliente +
                 '&VentaTotal=' + reciboTotal + '&Usuario=' +
                 usuario + '&' + 'IdPos=' + IdPosLocal + '&itemVentaDTO=' + JSON.stringify(venta);
      return this._http.post(this.url + params, null ).pipe(map( data => {
         let response: any[] = data.json();
         if (response[0].CodigoError === 'V0000') {
           console.log('Venta Ok')
         } else {
          let listadoErrores: any[] = [];
          for (let i = 0 ; i < response.length; i++) {
              let tmp: any[] = [];
              tmp.push(response[i].CodigoError);
              tmp.push(response[i].NombreProducto);
              tmp.push(response[i].NuevoSaldo);
              tmp.push(response[i].CantidadActual);
              listadoErrores.push(tmp);
          }
          let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Venta POS');
          swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
         }
        return response;
    }));
  };
}
