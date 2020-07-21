import { InventarioTransferencia, InventarioBackendKiosco, MensajeRespuesta } from './../model/inventario';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GLOBAL } from './global';
import { AdalService } from 'adal-angular4';
import { Inventario, InventarioTransaccion, ItemInventario, InfoPlantila, CrearPlantilla, ItemPlantilla } from '../model/inventario';
import { SweetAlert } from 'sweetalert/typings/core';
import * as _swal from 'sweetalert';
import { map } from 'rxjs/operators';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { Plantilla } from 'app/model/inventario';
import { BehaviorSubject } from 'rxjs';
import { DetalleKiosco } from 'app/model/kiosco';


@Injectable()
export class InventarioService {
  public  url: string;
  public  inventario: Inventario[];
  public  usuario: string;
  public  ListaPlantillas: Plantilla[];
  public  inventarioKioscoCompleto: InventarioTransferencia[] = [];
  private plantillasSource = new BehaviorSubject<Plantilla[]>(this.ListaPlantillas);
  public  listaPlantillasService$ = this.plantillasSource.asObservable();
  private inventarioSource = new BehaviorSubject<Inventario[]>(this.inventario);
  public  inventarioService$ = this.inventarioSource.asObservable();
  public  accentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u'
  }
   public transaccionInventario: InventarioTransaccion [] = [{
    Usuario: ''
  }];
  /**
  * Metódoss
  */
   constructor(
    private _http: Http,
    private adalSvc: AdalService
  ) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
  }
  /**
   * Recibir el inventario inicial del Backend
   */
  getInventarioBackend(idKiosco: number) {
    let usuario = 'Usuario=' + sessionStorage.getItem('Usuario');
    return this._http.get(this.url + '/inventario?' + usuario + '&' + 'IdKiosco=' + idKiosco).pipe(map((resultado) => {
      let data  = resultado.json().DataArray;
      this.inventario = data;
      let i = 0;
      for (i = 0; i < this.inventario.length; i++) {
        this.inventario[i].AgregarCantidad = 0;
        this.inventario[i].RetirarCantidad = 0;
        // tslint:disable-next-line:max-line-length
        this.inventario[i].CantidadFinal = this.inventario[i].Cantidad + this.inventario[i].AgregarCantidad - this.inventario[i].RetirarCantidad;
      }
      this.inventarioSource.next(this.inventario);
    return this.inventario;
    }));
  }

  getInventarioTransferenciaBackend(idKiosco: number) {
    let usuario = 'Usuario=' + sessionStorage.getItem('Usuario');
    return this._http.get(this.url + '/inventario?' + usuario + '&' + 'IdKiosco=' + idKiosco).pipe(map((resultado) => {
      let data = resultado.json().DataArray;
      this.inventarioKioscoCompleto = data;
      for (let i = 0; i < this.inventarioKioscoCompleto.length; i++) {
        this.inventarioKioscoCompleto[i].AgregarCantidad = 0;
        this.inventarioKioscoCompleto[i].RetirarCantidad = 0;
        this.inventarioKioscoCompleto[i].NuevaCantidadBodegaCentral = this.inventarioKioscoCompleto[i].CantidadBodegaCentral;
        this.inventarioKioscoCompleto[i].NuevaCantidadKiosco = this.inventarioKioscoCompleto[i].Cantidad;
      }
    return this.inventarioKioscoCompleto;
    }));
  }
  /**
   * @returns Método que muestra retona la lista de Kioscos filtrando por lo que no tienen el Flag de Bodega Central
   */
  getListaKioscoBackend() {
    return this._http.get(this.url + '/kiosco').pipe(map((resultado) => {
      const data: DetalleKiosco[]  = resultado.json().DataArray;
      let listaKioskos: DetalleKiosco[] = [];
      for (let kiosco of data ){
        if (!kiosco.FlagBodega){
            listaKioskos.push(kiosco);
        }
      }
      return listaKioskos;
    }));
  }

  /**
   * Buscar un Producto en la lista que se recibe del Backend.
   * @param {string} termino palabra ingresado en el campo buscador.
   * @returns un arreglo con los resultados obtenidos.
   * 1. Se define una arreglo de tipo inventario vacio donde se van a almacenar los resultados.
   * 2. Se recibe el termino y se convierte a minuscula el string para envitar errores.
   * 3. Se recorre el arreglo donde estan todos los producto en este caso this.inventario.
   * 4. Se guarda en una variable los nombre de los productos.
   * 5. Con la función indexOf se busca el termino ingresado esta función devuelve 0 o 1.
   * 6. Si  lo encuentra hace un push en al productoArr.
   * 7. Retorna un arreglo con todos los productos.
   */

  buscarProducto( termino: string ) {
    let productoArr: Inventario[] = [];
    termino = termino.toLowerCase();
    for (let producto of this.inventario ) {
        let nombre = producto.NombreProducto.toLowerCase();
        if ( nombre.indexOf(termino) >= 0) {
          productoArr.push( producto )
        }
    }
    return productoArr;
  }
  accent_fold (s) {
    if (!s) { return ''; }
    let ret = '';
    for (let i = 0; i < s.length; i++) {
      ret += this.accentMap[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  };

  buscarProductoTransferencia( termino: string ) {
    let productoArr:  InventarioTransferencia[] = [];
    termino = this.accent_fold(termino.toLowerCase());
     for (let item of this.inventarioKioscoCompleto ) {
        let nombre = this.accent_fold(item.NombreProducto.toLocaleLowerCase());
        if ( nombre.indexOf(termino) >= 0) {
          productoArr.push( item )
        }
    }
    return productoArr;
  }

  /* Método para Actualizar Inventario */
  actualizarInventario( ) {
    let ItemsInventario: ItemInventario [] = [];
    let menorCero: boolean = true;
    for (let i = 0; i < this.inventario.length; i++) {

      if (this.inventario[i].AgregarCantidad > 0) {
        let itemInventario: ItemInventario;
        itemInventario = new ItemInventario(
          this.inventario[i].AgregarCantidad,
          this.inventario[i].IdKiosco,
          this.inventario[i].IdKioscoNuevo,
          this.inventario[i].IdProducto
        );
        ItemsInventario.push(itemInventario);
      }
      if (this.inventario[i].RetirarCantidad > 0) {
        let itemInventario: ItemInventario;
        itemInventario = new ItemInventario(
          -this.inventario[i].RetirarCantidad,
          this.inventario[i].IdKiosco,
          this.inventario[i].IdKioscoNuevo,
          this.inventario[i].IdProducto
        );
        ItemsInventario.push(itemInventario);
      }
    }
      /* Construcción de Trama para enviar al servicio */
      let usuario = sessionStorage.getItem('Usuario');
      this.transaccionInventario[0].Usuario = usuario;
      this.transaccionInventario[0].ItemInventario = JSON.stringify(ItemsInventario);
      // tslint:disable-next-line:max-line-length
      let params:  any = 'Usuario=' + this.transaccionInventario[0].Usuario + '&' + 'ItemInventario=' + this.transaccionInventario[0].ItemInventario;
      return this._http.put(this.url + 'inventario?' + params, null)
      .pipe(map(response => {
        let respuesta: any[]  = response.json();
      return respuesta;
      }))
  }
  transferencia(idKioscoOrigen, idKioscoDestino) {
    let ItemsInventarioTransferencia: ItemInventario [] = [];
    let menorCero: boolean = true;
    for (let i = 0; i < this.inventarioKioscoCompleto.length; i++) {
      if (this.inventarioKioscoCompleto[i].AgregarCantidad > 0) {
        let itemInventario: ItemInventario;
        itemInventario = new ItemInventario(
          this.inventarioKioscoCompleto[i].AgregarCantidad,
          idKioscoOrigen,
          idKioscoDestino,
          this.inventarioKioscoCompleto[i].IdProducto
        );
        ItemsInventarioTransferencia.push(itemInventario);
      }
      if (this.inventarioKioscoCompleto[i].RetirarCantidad > 0) {
        let itemInventario: ItemInventario;
        itemInventario = new ItemInventario(
          this.inventarioKioscoCompleto[i].RetirarCantidad,
          idKioscoOrigen,
          idKioscoDestino,
          this.inventarioKioscoCompleto[i].IdProducto
        );
        ItemsInventarioTransferencia.push(itemInventario);
      }
    }
      /* Construcción de Trama para enviar al servicio */
      // tslint:disable-next-line:max-line-length
      let params:  any = 'inventario?' +  'Usuario=' + this.usuario + '&' + 'ItemInventario=' + JSON.stringify(ItemsInventarioTransferencia);
      return this._http.put(this.url + params, null)
      .pipe(map(response => {
        let respuesta: any[]  = response.json();
      return respuesta;
      }))
  }
  cargarPlantillas() {
    let params:  any = 'plantilla';
    return this._http.get(this.url + params, null)
    .pipe(map(data => {
      let respuesta = data.json().DataArray;
      this.ListaPlantillas = respuesta;
      this.plantillasSource.next(this.ListaPlantillas);
    return this.ListaPlantillas;
    }))
  }
  cargarInfoPlantilla(idPlantilla){
    let params:  any = 'plantilla?' + 'IdPlantilla=' + idPlantilla;
    return this._http.get(this.url + params, null)
    .pipe(map(data => {
      let respuesta: InfoPlantila [] = data.json().DataArray;
      if ( respuesta.length > 0) {
        for (let i = 0; i < this.inventarioKioscoCompleto.length; i++) {
          this.inventarioKioscoCompleto[i].RetirarCantidad = 0;
          for (let j = 0; j < respuesta.length; j++) {
            if ( this.inventarioKioscoCompleto[i].IdProducto === respuesta[j].IdProducto) {
              this.inventarioKioscoCompleto[i].RetirarCantidad = respuesta[j].Cantidad;
              this.inventarioKioscoCompleto[i].NuevaCantidadKiosco =
                Number(this.inventarioKioscoCompleto[i].Cantidad) + Number(this.inventarioKioscoCompleto[i].RetirarCantidad);
              this.inventarioKioscoCompleto[i].NuevaCantidadBodegaCentral =
                Number(this.inventarioKioscoCompleto[i].CantidadBodegaCentral) - Number(this.inventarioKioscoCompleto[i].RetirarCantidad);
            }
          }
        }
        let errorNoCambio: any[] = [{'CodigoError': 'INV8000'}]
        let listadoErrores: any[] = [];
        for (let i = 0; i < errorNoCambio.length; i++) {
          let tmp: any[] = [];
          tmp.push(errorNoCambio[i].CodigoError);
          tmp.push(errorNoCambio[i].NombreProducto);
          tmp.push(errorNoCambio[i].CantidadActual);
          listadoErrores.push(tmp);
        }
        let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Transferencias');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      } else {
        let errorNoCambio: any[] = [{'CodigoError': 'INV80001'}]
        let listadoErrores: any[] = [];
        for (let i = 0; i < errorNoCambio.length; i++) {
          let tmp: any[] = [];
          
          tmp.push(errorNoCambio[i].NombreProducto);
          tmp.push(errorNoCambio[i].CantidadActual);
          listadoErrores.push(tmp);
        }
        let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Transferencias');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      }
    return respuesta;
    }))
  }
  gestionPlantilla(crearPlantilla: CrearPlantilla, rutina: number) {
    let itemPlantilla: ItemPlantilla;
    let ItemsPlantilla: ItemPlantilla [] = [];
    for (let i = 0; i < this.inventarioKioscoCompleto.length; i++) {
      if (this.inventarioKioscoCompleto[i].RetirarCantidad > 0) {
        itemPlantilla = new ItemPlantilla (
          this.inventarioKioscoCompleto[i].IdProducto,
          this.inventarioKioscoCompleto[i].RetirarCantidad
        )
        ItemsPlantilla.push(itemPlantilla);
      }
    }
    let params: string = 'plantilla?' + 'Plantilla=' +
      JSON.stringify(crearPlantilla)  + '&' + 'itemPlantilla=' +
      JSON.stringify(ItemsPlantilla)  + '&' + 'Rutina=' + rutina + '&' + 'Usuario=' + this.usuario;
      return this._http.put(this.url  + params, null).pipe(map((data) => {
        let response: any[] = data.json();
            let listadoErrores: any[] = [];
            for (let i = 0; i < response.length; i++) {
              let tmp2: any[] = [];
              tmp2.push(response[i].CodigoError);
              listadoErrores.push(tmp2);
            }
            this.cargarPlantillas().subscribe();
            let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Crear Plantilla');
            swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
        return response;
    }))
  }
}


