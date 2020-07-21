import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { HistorialTransaccion } from '../../model/cliente';
import { UrlService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historial-transacciones',
  templateUrl: './historial-transacciones.component.html'
})
export class HistorialTransaccionesComponent implements OnInit, OnDestroy {
  public historialTransaccion: HistorialTransaccion[];
    /* Subcripcion */
    private consultarPermisoSubcription: Subscription;
  constructor(
    private _clienteService: ClienteService,
    private _sidebar: UrlService) { }

  ngOnInit( ) {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this._clienteService.historialTransacciones(null).subscribe( data => {
      this.historialTransaccion = data;
    });
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
