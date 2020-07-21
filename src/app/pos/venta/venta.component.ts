import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemVentaService } from '../../services/ItemVenta.service';
import { Subscription } from 'rxjs';
import { PersonaBilletera } from '../../model/PersonaBilletera';
import { PersonaBilleteraService } from '../../services/PersonaBilletera';
import { ItemVentaTransaccion } from '../../model/ItemVentaTransaccion';
import * as _sweetAlert from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';


const sweetAlert: SweetAlert = _sweetAlert as any;

declare var $: any;

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html'
})
export class VentaComponent implements OnInit, OnDestroy  {
  public resumenVenta: ItemVentaTransaccion[] = [];
  public ventaTotal: number =  0;
  public  ventaNumItems = 0;
  private _ventaActualSubscription: Subscription;
  private _totalActualSubscription: Subscription;
  private _numItemActualSubscription: Subscription;
  private tieneSaldo: boolean = false;
  // Atributos Cliente
  private _infoClienteValidadoSubscription: Subscription;
  private clienteConDescuento: boolean = false;
  cliente: PersonaBilletera[];
  constructor( private _itemventaService: ItemVentaService,
               private _clienteValidadoService: PersonaBilleteraService) {    }
  ngOnInit() {
    this._ventaActualSubscription = this._itemventaService.ventaActual$.subscribe(data =>
      this.resumenVenta = data);
    this._totalActualSubscription =  this._itemventaService.totalActual$.subscribe(total => this.ventaTotal = total);
    /*this._numItemActualSubscription = this._itemventaService.numItemsActual$.subscribe(num => {this.ventaNumItems = num});*/
    this._infoClienteValidadoSubscription = this._clienteValidadoService.clienteActual$.subscribe (cliente => { this.cliente = cliente });
    if (this.cliente.length > 0) {
      this.clienteConDescuento = this.cliente[0].PrecioEspecialCliente;
      this._itemventaService.clientetieneDescuento(this.clienteConDescuento);
      if (this.clienteConDescuento === true) {
        this._itemventaService.clientetieneDescuento(this.clienteConDescuento);
      }
    }
  }

  addItemVenta(item: ItemVentaTransaccion ) {
      if (item.Cantidad < item.cantidadActual) {
        item.Cantidad += 1;
        this._itemventaService.calcularTotal();
      } else {
        sweetAlert('Existencias Insuficientes',
        'Solamente tiene disponibles:  ' + item.cantidadActual + ' ' + item.Nombre + ' ' + 'para su venta' , 'warning');
      }
    }
  removeItemsVenta(item: ItemVentaTransaccion, cantidad) {
    if (item.Cantidad <= cantidad ) {
      // indexOf encuentra el indice del item en el arreglo de venta para eliminar
      if (this.resumenVenta.indexOf(item) > -1) {
         this.resumenVenta.splice(this.resumenVenta.indexOf(item), 1);
      }
    } else {
        item.Cantidad--;
    }
    this._itemventaService.calcularTotal();
  }
  clearCart() {
    this._itemventaService.clearCart();
  }
  validarSaldo() {
    let saldoCliente =  this.cliente[0].Saldo;
    let reciboTotal = this.ventaTotal;
    let tieneSaldo: boolean = false;
    //if (saldoCliente < reciboTotal) 
    //{
      //tieneSaldo = true;
      //this.tieneSaldo = tieneSaldo;
      //sweetAlert('Fondos Insuficientes', 'Por favor recargue su cuenta', 'error');

    //}else {
      this.abrirModalConfirmacion();
    //}
  }
  abrirModalConfirmacion() {
    $('#confirmacion-venta').modal({
      keyboard: false,
      backdrop: 'static',
    })
  }
  ngOnDestroy() {
    this._itemventaService.cambioVenta([]);
    this._itemventaService.cambioVentaTotal(0);
    this._ventaActualSubscription.unsubscribe();
    this._totalActualSubscription.unsubscribe();
      /*this._numItemActualSubscription.unsubscribe();*/
    this._infoClienteValidadoSubscription.unsubscribe();
  }
}
