import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from 'app/services/sidebar.service';
import { ClienteService } from 'app/services/cliente.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { HistorialRecarga } from '../../model/cliente';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-historial-recargas',
  templateUrl: './historial-recargas.component.html',
  styles: []
})
export class HistorialRecargasComponent implements OnInit, OnDestroy {
  public historialRecarga: HistorialRecarga[] = [] ;
  private consultarPermisoSubcription: Subscription;
  /* Variables para Busqueda */
  public clients: Observable<any[]>
  private busquedaCliente$ = new Subject<string>();
  public ClientName = '';
  public flag: boolean = false;

  constructor(private _clienteService: ClienteService,
    private _sidebar: UrlService) { }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.clients = this.busquedaCliente$
    .pipe(debounceTime(300))
    .pipe(distinctUntilChanged())
    .pipe(switchMap(term => term
      ? this._clienteService.search(term)
      : of<any[]>([])))
    .pipe(catchError(error => {
      console.log(error);
      return of<any[]>([]);
  }));
  }
  reversarRecargar(IdTransaccion) {
    this._clienteService.reversionRecarga(IdTransaccion).subscribe();
  }
  buscarCliente(term: string): void {
    this.flag = true;
    this.busquedaCliente$.next(term);
  }
  seleccionarUsuario(IdCliente) {
    this.flag = false;
    this._clienteService.historialRecargas(IdCliente).subscribe( data => {
          this.historialRecarga = data;
        /* Se aplana la información de Cliente  */
    });
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
