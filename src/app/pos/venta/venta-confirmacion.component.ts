import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemVentaService } from 'app/services/ItemVenta.service';
import { PersonaBilletera } from 'app/model/PersonaBilletera';
import { PersonaBilleteraService } from '../../services/PersonaBilletera';
import { VentaService } from '../../services/venta.service';
import { ResultadoTransaccion } from '../../model/venta';
import { ItemVentaTransaccion } from '../../model/ItemVentaTransaccion';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { PosService } from '../../services/pos.service';
import { InformacionPOS } from '../../model/pos';
const swal: SweetAlert = _swal as any;

declare var $: any;

@Component({
  selector: 'app-venta-confirmacion',
  templateUrl: './venta-confirmacion.component.html'
})
export class VentaConfirmacionComponent implements OnInit, OnDestroy {
  // Atributos para generar la venta
  public venta: ItemVentaTransaccion[];
  public ventaTotal: number =  0;
  public ventaNumItems = 0;
  public usuario: any;
  public deshabilitarBoton: Boolean = false;
  public isLoading: Boolean = false;
  public cliente: PersonaBilletera[];
  // Atributos Información POS
  public infoPOS: InformacionPOS
  private idPOSLocal: number;
  // Suscripciones
  private _ventaActualSubscription: Subscription;
  private _totalActualSubscription: Subscription;
  private _infoClienteValidadoSubscription: Subscription;

  constructor(private _itemventaService: ItemVentaService,
              private _clienteValidadoService: PersonaBilleteraService,
              private _ventaService: VentaService,
              private _posService: PosService) {
                this.usuario = sessionStorage.getItem('Usuario');
              this.idPOSLocal = Number(localStorage.getItem('idPOS'));
              }
  ngOnInit() {

    this._posService.estadoPOS().subscribe ((data) => {
      this.infoPOS = data;
    })
    this._ventaActualSubscription = this._itemventaService.ventaActual$.subscribe(data => {
      this.venta = data;
    });
    this._totalActualSubscription =  this._itemventaService.totalActual$.subscribe(total => {
      this.ventaTotal = total;
    });
    this._infoClienteValidadoSubscription = this._clienteValidadoService.clienteActual$.subscribe (cliente => {
    this.cliente = cliente;
    } );
  }
  pagar() {
     this.deshabilitarBoton = true;
     this.isLoading = true;
     let resultadoTransaccion: ResultadoTransaccion [] = [];
     this._ventaService.enviarCompra(this.idPOSLocal, this.venta, this.ventaTotal, this.cliente).subscribe( data => {
        resultadoTransaccion = data;
        console.log('resultadoTransaccion: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ', resultadoTransaccion);
        this.isLoading = false;
       if ( resultadoTransaccion[0].CodigoError === 'V0000' ) {
           let printContents, infoCliente;
           printContents = document.getElementById('print-section').innerHTML;
           infoCliente = document.getElementById('infoCliente').innerHTML;
           let popupWin = window.open('', '_blank', 'height=1,width=1');
           localStorage.setItem('impresionVenta',`
           <html>
             <head>
               <title>Recibo de Pago</title>
               <style>
               html, body
                 {
                 width: 450px;
                 font-family: Arial, Helvetica, sans-serif;
                 font-size:17px;
                 font-style: normal;
                 }
                 p {
                   text-align: left;
                   line-height: 0.7px;
                   font-style: normal;
                 }
                 h1 {
                  text-align: left;
                  font-size: 18px;
                 }
                 .legal {
                   text-align: center;

               }
               </style>
             </head>
           <body onload="window.print(),window.close()">
             <h1>COLEGIO SAN JORGE DE INGLATERRA</h1>
             <hr>
             <p>POS ${this.infoPOS.NombrePos} </p>
             <p>Lo atendio: ${this.usuario} </p>
             <p>Fecha: ${resultadoTransaccion[0].FechaCompra}</p>
             <p>Transacción No. ${resultadoTransaccion[0].IdTransaccion}</p>
             <hr>
             <p> ${printContents}</p>
             <p class="text-center">Saldo Nuevo: $ ${(resultadoTransaccion[0].NuevoSaldo.toLocaleString())}</p>
             <hr>
             <p class="legal"><strong>Gracias por su Compra</strong></p>
           </body>
           </html>`);
           popupWin.document.write(localStorage.getItem('impresionVenta'));
           popupWin.document.close();
           this._itemventaService.clearCart();
           this.cerrarModal();
           resultadoTransaccion = [];
       }
    })
  }
  cerrarModal() {
    $('#confirmacion-venta').modal('hide')
    this.deshabilitarBoton = false;
  }
  ngOnDestroy() {
    this._ventaActualSubscription.unsubscribe();
    this._totalActualSubscription.unsubscribe();
    this._infoClienteValidadoSubscription.unsubscribe();
  }
}



