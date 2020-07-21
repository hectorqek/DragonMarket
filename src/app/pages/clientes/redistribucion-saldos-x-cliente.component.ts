import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClienteService } from 'app/services/cliente.service';
import { UrlService } from 'app/services/sidebar.service';
import { ClienteRedistribucion } from 'app/model/cliente';
import { BolsilloRedistribucion } from '../../model/cliente';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-redistribucion-saldos-x-cliente',
  templateUrl: './redistribucion-saldos-x-cliente.component.html',
  styles: []
})
export class RedistribucionSaldosXClienteComponent implements OnInit {
  public responsableDatos: ClienteRedistribucion [] = [];
  public sumaSaldoActual: number = 0;
  public sumaless: number = 0;
  public sumaplus: number = 0;
  public sumaSaldoFinal: number = 0;
  private SumaLessSource: Subscription;
  private SumaPlusSource: Subscription;
  private SumaSaldoActualSource: Subscription;
  /* Variables para Busqueda */
  public clients: Observable<any[]>
  private busquedaCliente$ = new Subject<string>();
  public ClientName = '';
  public flag: boolean = false;
  public IdCliente: number;
  constructor(
    private _clienteService: ClienteService,
    private _sidebar: UrlService) { }

  ngOnInit() {
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
  this.SumaLessSource = this._clienteService.getResultSumaLess.subscribe( (data) => {
    this.sumaless = data;
  })
  this.SumaPlusSource = this._clienteService.getResultSumaPlus.subscribe( (data2) => {
    this.sumaplus = data2;
  } )
  }
  buscarCliente(term: string): void {
    this.flag = true;
    this.busquedaCliente$.next(term);
  }
  seleccionarUsuario(IdCliente) {
    this.IdCliente = IdCliente;
    this.flag = false;
    this.sumaSaldoActual = 0;
    this.sumaSaldoFinal = 0;
    this._clienteService.consultaClienteReversion(IdCliente).subscribe( data => {
          this.responsableDatos = data[0].Clientes;
          for (let i = 0; i < this.responsableDatos.length; i++) {
            for (let j = 0; j < this.responsableDatos[i].Bolsillos.length; j++) {
              this.sumaSaldoActual += Number(this.responsableDatos[i].Bolsillos[j].Saldo);
              this.sumaSaldoFinal += Number(this.responsableDatos[i].Bolsillos[j].SaldoFinal);
            }
          }
        /* Se aplana la información de Cliente  */
    });
  }

  sumavaloresless() {
    this._clienteService.sumavaloresless();
  }
  sumavaloresplus() {
    this._clienteService.sumavalorespluss();
  }
  redistribuirSaldo(ValorTotalOrigen: number, ValorTotalDestino: number) {
    this._clienteService.redistribuirSaldo(ValorTotalOrigen, ValorTotalDestino).subscribe(
      response => {
        let tmp: any[] = [];
        tmp.push(response);
        let listadoErrores: any[]  = [];
        for (let i = 0; i < tmp.length; i++) {
          let tmp2: any[] = [];
          tmp2.push(tmp[i].CodigoError);
          tmp2.push(tmp[i].IdTransaccion);
          listadoErrores.push(tmp2);
        }
        if (response.CodigoError === 'T0000') {
          this.seleccionarUsuario(this.IdCliente);
          this.sumaless = 0;
          this.sumaplus = 0;
        }
        let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Redistribución Saldo');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      },
      error => console.error('Error', error)
      );

  }
  calcularsumaSaldoFinal(Item: BolsilloRedistribucion ) {
    if (Item.Valorless < 0 || Item.Valorplus < 0 ) {
      swal('Importante', 'No se puede ingresar un valor negativo', 'warning');
      /*Item.Valorless = 0;
      Item.Valorplus = 0;*/
    }
    Item.SaldoFinal = Number(Item.SaldoFinal);
    Item.SaldoFinal = 0;
    Item.SaldoFinal = Number(Item.Saldo) - Number(Item.Valorless) + Number(Item.Valorplus);
}

}
