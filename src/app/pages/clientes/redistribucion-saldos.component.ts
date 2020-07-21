import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ResponsableConsulta, ResponsableRedistribucion, ClienteRedistribucion, BolsilloRedistribucion } from '../../model/cliente';
import { MensajeRespuesta } from '../../model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';
import { Subscription } from 'rxjs';
import { UrlService } from 'app/services/sidebar.service';


@Component({
  selector: 'app-redistribucion-saldos',
  templateUrl: './redistribucion-saldos.component.html'
})
export class RedistribucionSaldosComponent implements OnInit, OnDestroy {

  public usuario: string;
  public responsableDatos: ClienteRedistribucion[] = [];
  public sumaSaldoActual: number = 0;
  public sumaless: number = 0;
  public sumaplus: number = 0;
  public sumaSaldoFinal: number = 0;
  private SumaLessSource: Subscription;
  private SumaPlusSource: Subscription;
  private SumaSaldoActualSource: Subscription;
  private consultarPermisoSubcription: Subscription;
  constructor(private _clienteService: ClienteService, private _sidebar: UrlService) {
    this.usuario = sessionStorage.getItem('Usuario');
  }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.consultaBilletera();
    this.SumaLessSource = this._clienteService.getResultSumaLess.subscribe((data) => {
      this.sumaless = data;
    })
    this.SumaPlusSource = this._clienteService.getResultSumaPlus.subscribe((data2) => {
      this.sumaplus = data2;
    })

  }
  consultaBilletera() {
    this.sumaSaldoActual = 0;
    this.sumaSaldoFinal = 0;
    this.sumaless = 0;
    this.sumaplus = 0;
    this._clienteService.getResponsableClientes(this.usuario).subscribe(data => {
      this.responsableDatos = data[0].Clientes;
      for (let i = 0; i < this.responsableDatos.length; i++) {
        for (let j = 0; j < this.responsableDatos[i].Bolsillos.length; j++) {
          this.sumaSaldoActual += Number(this.responsableDatos[i].Bolsillos[j].Saldo);
          this.sumaSaldoFinal += Number(this.responsableDatos[i].Bolsillos[j].SaldoFinal);
        }
      }
    });
  }
  redistribuirSaldo(ValorTotalOrigen: number, ValorTotalDestino: number) {
    this._clienteService.redistribuirSaldo(ValorTotalOrigen, ValorTotalDestino).subscribe(
      response => {
        let tmp: any[] = [];
        tmp.push(response);
        let listadoErrores: any[] = [];
        for (let i = 0; i < tmp.length; i++) {
          let tmp2: any[] = [];
          tmp2.push(tmp[i].CodigoError);
          tmp2.push(tmp[i].IdTransaccion);
          listadoErrores.push(tmp2);
        }
        if (response.CodigoError === 'T0000') {
          this.consultaBilletera();
          this.sumaless = 0;
          this.sumaplus = 0;
        }
        let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Redistribución Saldo');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      },
      error => console.error('Error', error)
    );
  }
  sumavaloresless() {
    this._clienteService.sumavaloresless();
  }
  sumavaloresplus() {
    this._clienteService.sumavalorespluss();
  }
  calcularsumaSaldoFinal(Item: BolsilloRedistribucion) {
    if (Item.Valorless < 0 || Item.Valorplus < 0) {
      swal('Importante', 'No se puede ingresar un valor negativo', 'warning');
    } else if (!Number.isInteger(Item.Valorless) || !Number.isInteger(Item.Valorplus)) {
      swal('Importante', 'No se aceptan caracteres especiales, ingrese solo numeros', 'warning');
    }
    Item.SaldoFinal = Number(Item.SaldoFinal);
    Item.SaldoFinal = 0;
    Item.SaldoFinal = Number(Item.Saldo) - Number(Item.Valorless) + Number(Item.Valorplus);
  }
  ngOnDestroy() {
    this.SumaLessSource.unsubscribe();
    this.SumaPlusSource.unsubscribe();
    this.consultarPermisoSubcription.unsubscribe();
  }
}
