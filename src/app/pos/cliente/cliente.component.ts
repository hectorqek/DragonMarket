import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonaBilletera } from '../../model/PersonaBilletera';
import { Subscription } from 'rxjs';
import { PersonaBilleteraService } from '../../services/PersonaBilletera';
import { UrlService } from '../../services/sidebar.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit, OnDestroy {
  Url: string;
  cliente: PersonaBilletera[];
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;
  private _infoClienteValidadoSubscription: Subscription;

  constructor(
    private _sidebar: UrlService,
    private _clienteValidadoService: PersonaBilleteraService,
  ) { }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this._infoClienteValidadoSubscription = this._clienteValidadoService.clienteActual$.subscribe (cliente => {
      this.cliente = cliente;
    } );
  };
  ngOnDestroy() {
    this._infoClienteValidadoSubscription.unsubscribe();
    this.consultarPermisoSubcription.unsubscribe();
  }
}

