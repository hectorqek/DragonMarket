import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ClienteService } from 'app/services/cliente.service';
import { UrlService } from 'app/services/sidebar.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResponsableDevolucion, BolsilloDevolucion } from '../../model/cliente';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-devolucion-saldo',
  templateUrl: './devolucion-saldo.component.html'
})
export class DevolucionSaldoComponent implements OnInit, OnDestroy {

  /* Variables clase */
  public BolsilloSeleccionado: number = 0;
  public infoCliente: ResponsableDevolucion[];
  public infoClienteBilletera: ResponsableDevolucion[];
  public sumaTotal: number = 0;
  public desahabilitarBoton: boolean = true;
  /* Variables para Busqueda */
  public clients: Observable<any[]>
  private busquedaCliente$ = new Subject<string>();
  public ClientName = '';

  public flag: boolean = true;
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;
  private SumaTotalSubcription: Subscription;
  @ViewChild('bolsillo') myButton: ElementRef;
  constructor(private _clienteService: ClienteService, private _sidebar: UrlService, fb: FormBuilder) { }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.clients = this.busquedaCliente$
      .pipe(debounceTime(300))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => term ? this._clienteService.search(term) : of<any[]>([])))
      .pipe(catchError(error => {
        console.log(error);
        return of<any[]>([]);
      }));

  }
  seleccionarClienteBolsillo(IdCliente) {
    this.flag = false;
    let idCliente;
    this._clienteService.getClienteDevolucion(IdCliente).subscribe(responsable => {
      this.infoCliente = responsable;
      idCliente = this.infoCliente[0].Clientes[0].IdCliente;
      this.Valor(1);
      this.bolsilloUsuario(idCliente, 1);
    });

  }
  bolsilloUsuario(IdCliente, idBolsillo) {
    this.sumaTotal = 0;
    this._clienteService.getClienteDevolucion(IdCliente).subscribe(responsable => {
      this.infoClienteBilletera = responsable;
    });
  }

  buscarCliente(term: string): void {
    this.flag = true;
    this.busquedaCliente$.next(term);
  }
  devolucionSaldo(devolucionCliente: ResponsableDevolucion[], valorTotalAjuste: number) {
    for (let i = 0; i < devolucionCliente[0].Clientes[0].Bolsillos.length; i++) {
      if (devolucionCliente[0].Clientes[0].Bolsillos[i].IdBolsillo === this.BolsilloSeleccionado) {
        if (devolucionCliente[0].Clientes[0].Bolsillos[i].Nota === null ||
          devolucionCliente[0].Clientes[0].Bolsillos[i].Nota === '' ||
          devolucionCliente[0].Clientes[0].Bolsillos[i].Nota === undefined
        ) {
          swal('Importante', 'Debe Ingresar un texto en Nota Crédito', 'error');
        } else {
          this._clienteService.devolucionCliente(devolucionCliente, valorTotalAjuste).subscribe();
        }
      }
    }
  }
  Valor(Id) {
    this.BolsilloSeleccionado = Id;
  }
  calcularValorTotalAjuste(Item: BolsilloDevolucion) {
    if (Item.ValorAjuste === null || Item.ValorAjuste === undefined) {
      Item.ValorAjuste = 0;
    }
    if (Item.ValorAjuste < 0) {
      swal('Importante', 'No se puede ingresar un valor negativo', 'warning');
    } else if (!Number.isInteger(Item.ValorAjuste)) {
      swal('Importante', 'No se aceptan caracteres especiales, ingrese solo numeros', 'warning');
    }
    this.sumaTotal = 0;
    this.sumaTotal += Item.ValorAjuste;
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
