import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { GLOBAL } from './global';
import { GestionItemVenta, ItemVenta, CrearItemVenta, Categoria, EditarItemVenta, ItemVentaCompleto } from '../model/ItemVenta';
import { map } from 'rxjs/operators';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../model/menu';
import { Producto } from 'app/model/producto';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class GestionItemVentaService {

  /* Atributos */
  public usuario: string;
  public url: string;
  public itemsVenta: GestionItemVenta[] = [];
  private ItemsSource = new BehaviorSubject<GestionItemVenta[]>(this.itemsVenta);
  public ListaItemService$ = this.ItemsSource.asObservable();
  public accentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u'
  }

  constructor(private _http: Http, private router: Router) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
  }
  consultarItemVenta() {
    let params: string = 'itemventa';
    return this._http.get(this.url + params).pipe(map((data) => {
      this.itemsVenta = data.json().DataArray;
      this.ItemsSource.next(this.itemsVenta);
      return this.itemsVenta;
    }, error => console.error('Error al consultar ItemVenta', error)))
  }
  consultariaUntemVenta(IdItemVenta: number) {
    let params: string = 'itemventa?' + 'IdItemVenta=' + IdItemVenta;
    return this._http.get(this.url + params).pipe(map((data) => {
      let ItemVentaCompleto: ItemVentaCompleto[] = data.json();
      return ItemVentaCompleto[0]

    }, error => console.error('Error al consultar ItemVenta', error)))

  }
  accent_fold(s) {
    if (!s) { return ''; }
    let ret = '';
    for (let i = 0; i < s.length; i++) {
      ret += this.accentMap[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  };
  buscarItemVenta(termino: string) {
    let itemsArr: GestionItemVenta[] = [];
    termino = this.accent_fold(termino.toLowerCase());
    for (let item of this.itemsVenta) {
      let nombre = this.accent_fold(item.Nombre.toLowerCase());
      if (nombre.indexOf(termino) >= 0) {
        itemsArr.push(item)
      }
    }
    return itemsArr;
  }
  crearItemVenta(ItemVentaCrear: CrearItemVenta, productos: Producto[], categorias: Categoria[], menus: Menu[], rutina: number) {
    let params: any = 'itemventa?' + 'ItemVenta=' + JSON.stringify(ItemVentaCrear) + '&' + 'Productos=' +
      JSON.stringify(productos) + '&' + 'Categoria=' +
      JSON.stringify(categorias) + '&' + 'Menu=' +
      JSON.stringify(menus) + '&' + 'Rutina=' + rutina + '&' +
      'Usuario=' + this.usuario;
      console.log(params);
      return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      console.log('crearItemVenta',data.json());
      let tmp: any[] = [];
      tmp.push(response);
      let listadoErrores: any[] = [];
      for (let i = 0; i < tmp.length; i++) {
        let tmp2: any[] = [];
        tmp2.push(tmp[i].CodigoError);
        tmp2.push(tmp[i].IdTransaccion);
        listadoErrores.push(tmp2);
      }
      this.consultarItemVenta().subscribe();
      // tslint:disable-next-line:max-line-length
      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, rutina === 0 ? 'Crear Item Venta' : 'Actualizar Item Venta');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
    return response;
    }))
  }

  editarUnProducton(item: ItemVenta) {
    let params: string = 'itemVenta?' + 'ItemVenta=' + JSON.stringify(item) + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      let tmp: any[] = [];
      tmp.push(response);
      let listadoErrores: any[] = [];
      for (let i = 0; i < tmp.length; i++) {
        let tmp2: any[] = [];
        tmp2.push(tmp[i].CodigoError);
        tmp2.push(tmp[i].IdTransaccion);
        listadoErrores.push(tmp2);
      }
      if (response.CodigoError === 'IVT0000') {
        this.consultarItemVenta().subscribe();
      }
      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Item de Venta');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return response;
    }))
  }
  consultarItemVentaEditar(IdItemVenta) {
    let params: string = 'itemventa?IdItemVenta=';
    return this._http.get(this.url + params + IdItemVenta).pipe(map((data) => {
      let item = data.json();
      return item;
    }, error => console.error('Error al consultar ItemVenta', error)))
  }
}


