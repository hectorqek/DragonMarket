import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { GLOBAL } from './global';
import { ItemVenta } from '../model/ItemVenta';
import { ItemVentaTransaccion } from '../model/ItemVentaTransaccion';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class ItemVentaService {
  /**
   * Atributos
   */
  public url: string;
  public usuario: string;

  /**
   * Creación de los Subject para emitir los eventos
   */
  private ventaService: ItemVentaTransaccion[] = [];
  private ventaSource = new BehaviorSubject<ItemVentaTransaccion[]>(this.ventaService);

  private ventaTotal = 0;
  private ventaTotalSource = new BehaviorSubject<number>(this.ventaTotal);

  private clienteDescuento: boolean;
  private clienteDescuentoSource = new BehaviorSubject<boolean>(this.clienteDescuento);

  /**
   * Creación de los observables para poder suscribir y solo leer los datos.
  */
  public ventaActual$ = this.ventaSource.asObservable();
  public totalActual$ = this.ventaTotalSource.asObservable();
  public clienteDescuento$ = this.clienteDescuentoSource.asObservable();

  /**
  * Metódos
  */
  constructor(
    private _http: Http,
    private router: Router
  ) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
  }
 /**
  * Consulta de los productos del Backend para usar en el componente Productos
  * @param IdMenu
  * Se hace un llamado get al servidor los parametros de la variable params.
  */
  getItemVentaBackend(IdMenu) {
    let idPOS = Number(localStorage.getItem('idPOS'));
    let params: string = 'itemventa?' + 'IdPos=' + idPOS + '&' + 'IdMenu=' + IdMenu + '&' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map((resultado) => {
      const data = resultado.json().DataArray;
      return data;
    }));
  }

  /**
   * Método que deteca los cambios en el objeto ventaService, que contiene 
   * toda la información de la venta a realizar.
   * @param venta
   * Emite la información al Behavior Subject.
   */

  cambioVenta(venta: ItemVentaTransaccion[]) {
    this.ventaService = venta;
    this.ventaSource.next(this.ventaService);
  }
  /**
   * Detección cambio valor total de la venta
   * @param total
   * Este método permite emitir el cambio en el valor total de la venta a los
   * componentes que lo requieran.
   */
  cambioVentaTotal(total: number) {
    this.ventaTotal = total;
    this.ventaTotalSource.next(this.ventaTotal);
  }
  calcularTotal() {
    let total = 0;
    let cartNum = 0;
    this.ventaService.forEach(function (item: ItemVentaTransaccion) {
      total += (item.PrecioVenta * item.Cantidad);
      cartNum += item.Cantidad;
    });
    this.ventaTotal = total;
    this.cambioVentaTotal(this.ventaTotal);
  }
  clientetieneDescuento(clienteDescuento: boolean) {
    this.clienteDescuento = clienteDescuento;
    this.clienteDescuentoSource.next(clienteDescuento);
  }

  /** Métodos para actualizar valores del arreglo de venta */

  addItemVenta(item: ItemVenta) {
    let i = 0;
    let index = -1;
    while (i < this.ventaService.length && index === -1) {
      // Encontrar el producto con el ID Item;
      if (item.IdItemVenta === this.ventaService[i].IdItemVenta) {
        index = i;
      }
      i++;
    }
    if (index !== -1) {
      if (this.ventaService[index].Cantidad < this.ventaService[index].cantidadActual ) {
        this.ventaService[index].Cantidad += 1;
      } else {
        swal('Existencias Insuficientes',
        'Solamente tiene disponibles:  '
        + this.ventaService[index].cantidadActual + ' ' + this.ventaService[index].Nombre + ' ' + 'para su venta.' , 'warning');
      }

    } else {
      // Crear el nuevo producto en la lista.
      let nuevaVenta: ItemVentaTransaccion;
      let precio: number = 0;
      /**
      * Se valida si el cliente tiene PrecioEspecial para mostrar precioVenta o PrecioDescuento
      */
      if (this.clienteDescuento === true) {
        precio = item.PrecioEspecial;

      }
      if (this.clienteDescuento !== true) {
        precio = item.PrecioVenta;
      }
      nuevaVenta = new ItemVentaTransaccion(item.IdItemVenta, item.Nombre, 1, precio, precio, item.Cantidad);
      this.ventaService.push(nuevaVenta);
      this.cambioVenta(this.ventaService);
    }
    this.calcularTotal();
  }

  clearCart() {
    // Borrar la variable local y después sincronizar
    this.ventaService = [];
    this.ventaTotal = 0;
    this.router.navigate(['/pos/seleccionar-cliente']);
  }
};


