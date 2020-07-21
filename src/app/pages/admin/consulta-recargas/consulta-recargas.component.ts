import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from 'app/services/sidebar.service';
import { ClienteService } from 'app/services/cliente.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { HistorialRecarga, HistorialTransaccion } from '../../../model/cliente';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { TitularService } from 'app/services/titular.service';
@Component({
  selector: 'app-consulta-recargas',
  templateUrl: './consulta-recargas.component.html',
  styleUrls: []
})
export class ConsultaRecargasComponent implements OnInit , OnDestroy {
  public historialRecarga: HistorialRecarga[] = [] ;
  public historialTransaccion: HistorialTransaccion[];
  private consultarPermisoSubcription: Subscription;
  /* Variables para Busqueda */
  public clients: Observable<any[]>
  private busquedaCliente$ = new Subject<string>();
  public ClientName = '';
  public flag: boolean = false;

  constructor(private _clienteService: ClienteService,
    private _sidebar: UrlService,
    private _titularService: TitularService) { }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.clients = this.busquedaCliente$
    .pipe(debounceTime(300))
    .pipe(distinctUntilChanged())
    .pipe(switchMap(term => term
      ? this._titularService.search(term)
      : of<any[]>([])))
    .pipe(catchError(error => {
      console.log(error);
      return of<any[]>([]);
  }));
  console.log('this.clients: ', this.clients);
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
    this._clienteService.historialTransacciones(IdCliente).subscribe( data => {
      this.historialTransaccion = data;
    });
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
