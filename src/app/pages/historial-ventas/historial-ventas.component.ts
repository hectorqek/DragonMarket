import { Component, OnInit, OnDestroy } from '@angular/core';
import { PosService } from '../../services/pos.service';
import { HistorialTransaccion } from '../../model/cliente';
import { HistorialVenta } from '../../model/pos';

import { UrlService } from 'app/services/sidebar.service';
import { Subscription } from '../../../../node_modules/rxjs';

declare var $: any;
@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html'
})
export class HistorialVentasComponent implements OnInit, OnDestroy {

  public historialVentas: HistorialVenta[];
    /* Subcripcion */
    private consultarPermisoSubcription: Subscription;
    private historialVentasSubscription: Subscription;
  constructor(
    private _posService: PosService,
    private _sidebar: UrlService) { }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.historialVentasSubscription = this._posService.historialventas().subscribe( (data) => {
      this.historialVentas = data;
    });
    this.focusIngresarCliente();
  }
  AbrirModal() {
    $('#historial-venta-usuario').modal('show')
  }
  focusIngresarCliente() {
    $('#identificacionCliente').focus();
  }
  reversarTransaccion(IdTransaccion) {
    this._posService.reversionVenta(IdTransaccion).subscribe();
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
    this.historialVentasSubscription.unsubscribe();
  }

}
