import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from 'app/services/sidebar.service';
import { ReglasNotificacionesService } from 'app/services/reglas-notificaciones.service';
import { ReglaConsumoGuardar,ReglaConsumoTransaccion, ClienteReglaConsumo } from 'app/model/cliente';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';
import { Subscription } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-reglaConsumo',
  templateUrl: './regla-consumo.component.html',
  providers: [ReglasNotificacionesService]
})
export class ReglaConsumoComponent implements OnInit, OnDestroy {
  model: any = {
    onColor: 'primary',
    offColor: 'secondary',
    onText: 'Si',
    offText: 'No',
    disabled: false,
    size: 'sm',
    value: true
  };

  public reglaConsumo: ReglaConsumoGuardar[] = [];
  clienteReglaConsumo : ClienteReglaConsumo;
  public reglaConsumoTransaccion: ReglaConsumoTransaccion[] = [];
  public isLoading: boolean;
  public listaProductoSubcription: Subscription;
  public productosSeleccionadosconCantidad = [];

  constructor(private _reglas: ReglasNotificacionesService, private _sidebar: UrlService) {
    this.isLoading = false; 
   }

  ngOnInit() {
    this.consultarReglaLimitacionConsumo();
  }

  consultarReglaLimitacionConsumo() {
    this._reglas.consultarReglaLimitacionConsumo().subscribe( data => {
      this.clienteReglaConsumo = data[0].Clientes;      
    });
    this.listaProductoSubcription = this._reglas.listaReglasService$.subscribe( (data) => {
      if(data !== undefined){
      this.clienteReglaConsumo = data[0].Clientes;
      }
    })
  }

  actualizarReglaConsumoItemVenta(IdCliente: string, IdBolsillo: number,  IdRegla: string, MontoItem: string, EstadoRegla: boolean, IdItemVenta: number, Rutina: number) {
    this.isLoading = true;
    let idRegla = parseInt(IdRegla, 10);
    let montoItem = parseInt(MontoItem, 10);
    let respuesta: any[] = [];
    if ( idRegla === 3 &&  montoItem === 0 && EstadoRegla ) {
      let codigoError = ['RG-001', 0];
      respuesta.push(codigoError);
      this.isLoading = false;
      this.notificacion(respuesta);
      this.consultarReglaLimitacionConsumo();
    }
    if (typeof respuesta !== 'undefined' && respuesta != null && respuesta.length != null && respuesta.length === 0) {
      let objeto1: ReglaConsumoTransaccion;
        objeto1 = new ReglaConsumoTransaccion(IdCliente, IdBolsillo, idRegla, montoItem, EstadoRegla, IdItemVenta, Rutina);
        this.productosSeleccionadosconCantidad.push(objeto1);
      this._reglas.actualizarReglaLimitacionConsumo(this.productosSeleccionadosconCantidad).subscribe( (response) => {
        let tmp: any[] = [];
        tmp.push(response);
        let tmp2: any[] = [];
        for (let i = 0; i < tmp.length; i++) {
          tmp2.push(tmp[i].CodigoError);
          tmp2.push(tmp[i].IdTransaccion);
        }
        respuesta.push(tmp2);
        this.notificacion(respuesta);
        if (response.CodigoError === 'RG0000') {
          this.isLoading = false;
          this.consultarReglaLimitacionConsumo();
        }
      },
      error => console.error('Error al actualizar la regla', error));
    }
  }

  eliminarReglaConsumoItemVenta(IdCliente: string, IdBolsillo: number,  IdRegla: string, MontoItem: string, EstadoRegla: boolean, IdItemVenta: number) {
    this.isLoading = true;
    let idRegla = parseInt(IdRegla, 10);
    let montoItem = parseInt(MontoItem, 10);
    let respuesta: any[] = [];
    if ( idRegla === 2 &&  montoItem === 0 && EstadoRegla ) {
      let codigoError = ['RG-001', 0];
      respuesta.push(codigoError);
      this.isLoading = false;
      this.notificacion(respuesta);
      this.consultarReglaLimitacionConsumo();
    }
    if (typeof respuesta !== 'undefined' && respuesta != null && respuesta.length != null && respuesta.length === 0) {
      this._reglas.eliminarReglaLimitacionConsumo(IdCliente, IdBolsillo, idRegla,  montoItem, EstadoRegla, IdItemVenta).subscribe( (response) => {
        let tmp: any[] = [];
        tmp.push(response);
        let tmp2: any[] = [];
        for (let i = 0; i < tmp.length; i++) {
          tmp2.push(tmp[i].CodigoError);
          tmp2.push(tmp[i].IdTransaccion);
        }
        respuesta.push(tmp2);
        this.notificacion(respuesta);
        if (response.CodigoError === 'RG0000') {
          this.isLoading = false;
          this.consultarReglaLimitacionConsumo();
        }
      },
      error => console.error('Error al eliminar la regla', error));
    }
  }

  abrirModalAgregarItemVenta(IdCliente: any, IdBolsillo: any, NombreCliente: any, ApellidoCliente: any, NombreBolsillo: any) {
    Promise.resolve(null).then(() =>  this.reglaConsumo = [{IdCliente, IdBolsillo, NombreCliente, ApellidoCliente, NombreBolsillo}]);
    $('#reglaAgregarItemVenta').modal({
      keyboard: false,
      backdrop: 'static'
    });
  }

  notificacion(respuesta: any[]) {
    this.isLoading = false;
    let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(respuesta, 'Regla de consumo');
    swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
  }

  ngOnDestroy() {
    this.listaProductoSubcription.unsubscribe();
  }
}
