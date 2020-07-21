import { Component, OnInit } from '@angular/core';
import { HistorialVenta } from '../../model/pos';
import { PosService } from '../../services/pos.service';
declare var $: any;
@Component({
  selector: 'app-historial-ventas-usuario',
  templateUrl: './historial-ventas-usuario.component.html',
  styles: []
})
export class HistorialVentasUsuarioComponent implements OnInit {

  public historialVentas: HistorialVenta[];
  constructor(private _posService: PosService) { }

  ngOnInit() {
    this.focusIngresarCliente();
  }
  ValidarCliente(id: string) {
    this._posService.historialventasUsuario(id).subscribe(
      (data) => {
        this.historialVentas = data;
      });
    }

  focusIngresarCliente() {
    $('#identificacionCliente').focus();
  }
  reversarTransaccion(IdTransaccion) {
    this._posService.reversionVenta(IdTransaccion).subscribe();
  }
}
