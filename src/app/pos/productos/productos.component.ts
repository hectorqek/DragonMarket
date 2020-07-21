import { Component, OnInit, Output, EventEmitter, OnChanges, OnDestroy, Input, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';
import { ItemVentaService } from '../../services/ItemVenta.service';
import { ItemVenta } from '../../model/ItemVenta';
import { CategoriasComponent } from './categorias/categorias.component';
import { ItemVentaTransaccion } from '../../model/ItemVentaTransaccion';
import { FiltroCategoriaPipe } from '../pipes/filtro-categoria.pipe';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { PosService } from '../../services/pos.service';
import { InformacionPOS } from 'app/model/pos';

const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit, OnDestroy {

  /**
   * Atributos
   */
  productos = null;

  @Input() categoriaSeleccionada: number;
  public idPOS = Number(localStorage.getItem('idPOS'));
  public infoPOS: InformacionPOS;
  public isLoading: Boolean;
  constructor (
    private _itemventaService: ItemVentaService,
    private _posService: PosService,
  ) { }

  /**
   * Se inicializa la variable de tipo ItemVentaService que permite acceder a los métodos del servicios.
   * Adicionalente se hace un subcribe para hacer la consulta de los productos y regresar la data de la Base de Datos
   * @returns todos los productos de la tabla Item Venta de la Base de Datos
   */
  ngOnInit() {
    /**
     * Suscripción al servicio ItemVentaService para obtener productos del Back-End
     */
    this.consultarEstadoPOS();
    /**
      * Método para recibir productos del Backend
    */

    this._itemventaService.getItemVentaBackend(this.infoPOS.IdMenu).subscribe( respuesta => {
      this.productos = respuesta;
     });
  }
  consultarEstadoPOS() {
    this._posService.infoPOSService$.subscribe( (data) => {
      this.infoPOS = data;
    })
  }

  agregarAVenta(item: ItemVenta) {
    if (item.Cantidad > 0) {
       this._itemventaService.addItemVenta(item);
    }else {
      swal('Cantidad Insuficiente', 'No hay existencias registradas de este producto.', 'error');
    }
  }
  ngOnDestroy() {

  }

}
