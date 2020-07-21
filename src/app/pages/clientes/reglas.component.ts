import { Component, OnInit } from '@angular/core';
import { UrlService } from 'app/services/sidebar.service';
import { ReglasNotificacionesService } from 'app/services/reglas-notificaciones.service';
import { ClienteNotificacionReglas } from 'app/model/cliente';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';


@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.component.html',
  providers: [ReglasNotificacionesService]
})
export class ReglasComponent implements OnInit {
  model: any = {
    onColor: 'primary',
    offColor: 'secondary',
    onText: 'Si',
    offText: 'No',
    disabled: false,
    size: 'sm',
    value: true
  };

  notificiacionReglas: ClienteNotificacionReglas;
  public isLoading: boolean;
  constructor(private _reglas: ReglasNotificacionesService, private _sidebar: UrlService) {
    this.isLoading = false; 
   }

  ngOnInit() {
    this.consultarReglasNotificaciones();
  }

  consultarReglasNotificaciones() {
    this._reglas.consultarReglas().subscribe( data => {
      this.notificiacionReglas = data[0].Clientes;

    });
  }
  actualizarNotificacion(  IdCliente: string, IdBolsillo: number,  IdRegla: string, MontoItem: string, EstadoRegla: boolean) {
    this.isLoading = true;
    // tslint:disable-next-line:radix
    let idRegla = parseInt(IdRegla, 10);
    let montoItem = parseInt(MontoItem, 10);
    let respuesta: any[] = [];
    if ( idRegla === 2 &&  montoItem === 0 && EstadoRegla ) {
      let codigoError = ['RG-001', 0];
      respuesta.push(codigoError);
      this.isLoading = false;
      this.notificacion(respuesta);
      this.consultarReglasNotificaciones();
    }
    if (typeof respuesta !== 'undefined' && respuesta != null && respuesta.length != null && respuesta.length === 0) {
      this._reglas.actualizarRegla(IdCliente, IdBolsillo, idRegla,  montoItem, EstadoRegla).subscribe( (response) => {
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
          this.consultarReglasNotificaciones();
        }
      },
      error => console.error('Error al actualizar reglas y notificaciones', error));
    }
  }
  notificacion(respuesta: any[]) {
    let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(respuesta, 'Notificaciones y Reglas');
    swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
  }
}
