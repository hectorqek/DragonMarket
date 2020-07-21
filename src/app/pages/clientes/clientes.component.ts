import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonaBilleteraService } from '../../services/PersonaBilletera';

import { FormControl } from '@angular/forms';
import { PersonaBilletera } from '../../model/PersonaBilletera';
import { Http } from '@angular/http'
import { GLOBAL } from '../../services/global';
import { AdalService } from 'adal-angular4';
import { Responsable, MedioPago } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Router } from '@angular/router';
import { Subscription ,  Subject } from 'rxjs';

import { UrlService } from '../../services/sidebar.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

// First, you need to create the `numberMask` with your desired configurations
declare var $: any;

enum Key {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Escape = 27,
  ArrowLeft = 37,
  ArrowRight = 39,
  ArrowUp = 38,
  ArrowDown = 40
}
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  usuario: any;
  public idCliente: string ;
  public personaB: PersonaBilletera[];
  public responsable: Responsable[] = [];
  public infoCliente;
  public SumaRecarga: number;
  public SumaRecarga1: number;
  public resultadoComplete = true;
  public verResumenRecarga = false;
  public verBtnPSE = false;
  public myModel = ''
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public numberMask = createNumberMask({
  prefix: '',
  suffix: '' // This will put the dollar sign at the end, with a space.
  })
  public mayor0: boolean = false;
  private sendRecarga: Subscription;
  public MedioPago: MedioPago[] = [];
  public url;
  /* Variables para Busqueda */
  public  clients: Observable<any[]>
  private busquedaCliente$ = new Subject<string>();
  public  ClientName = '';
  public  flag: boolean = true;
    /* Subcripcion */
    private consultarPermisoSubcription: Subscription;

  /**
  * Métodos 
  */
  constructor( private _clienteService: ClienteService,
    private _http: Http, private adalSvc: AdalService,
    private router: Router,
    private _sidebar: UrlService) {
    this.url = GLOBAL.url;
    this.usuario = this.adalSvc.userInfo.userName;

  }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.MedioPago = this._clienteService.getMediosPago();
    this.SumaRecarga = 0;
    this.clients = this.busquedaCliente$
    .pipe(debounceTime(300))
    .pipe(distinctUntilChanged())
    .pipe(switchMap(term => term  ? this._clienteService.search(term) :of<any[]>([]) ))
    .pipe(catchError(error => {
      console.log(error);
      return of<any[]>([]);
  }));
  }

  seleccionarUsuario(usuario) {
    if (usuario.ClientId !== 0) {
      this.flag = false;
     this.isLoading = true;
     this._clienteService.getBilleteraClienteId(usuario).subscribe( responsable => {
        this.responsable = responsable;
        /* Se aplana la información de Cliente  */
        if (this.responsable[0].Clientes.length > 0) {
          for (let j = 0; j < this.responsable[0].Clientes.length; j++) {
            for (let k = 0; k < this.responsable[0].Clientes[j].Bolsillos.length; k++) {
              this.responsable [0].Clientes[j].Bolsillos[k].ValorRecarga = 0;
              this.SumaRecarga += Number(this.responsable[0].Clientes[j].Bolsillos[k].ValorRecarga);
            }
          }
          this.infoCliente = this.responsable[0].Clientes;
          this.verResumenRecarga = true;
          this.isLoading = false;
        }else{
          this.isLoading = false;
          this.verResumenRecarga = false;
        }
    });
    this.resultadoComplete = false;
  }else {
    return false;
  }
  }

  actualizarValorTotal(valor: any) {
    if (valor.Clientes.length > 0){
      this.SumaRecarga1 = 0
      for (let j = 0; j < valor.Clientes.length; j++) {
        for (let k = 0; k < valor.Clientes[j].Bolsillos.length; k++) {
         this.SumaRecarga1 += Number(valor.Clientes[j].Bolsillos[k].ValorRecarga);
          this.SumaRecarga = this.SumaRecarga1;
        }
      }
    }

  }
  recarga(valores: Responsable[], valorTotalRecarga: number, origen: string, medioPago: string) {
      this.isLoading = true;
      this.mayor0 = true;
      this.sendRecarga = this._clienteService.recarga(valores, valorTotalRecarga, origen, medioPago ).subscribe( respuesta => {
        if (respuesta.CodigoError === '0' ) {
            this.isLoading = false;
            this.recargaLocal();
          }
        }
      );
      valores = [];
      /*this.seleccionarUsuario(this.usuario);*/
      this.SumaRecarga = 0;
  }
  reImprimir(){
    this.router.navigate(['/cliente/confirmacion-recarga/' + localStorage.getItem('UltimaRecarga')]);

   }
  seleccionarMedioPago() {
    $('#medio-pago').modal('show');
  }
  transaccionAprobada() {
    $('#medio-pago').modal('hide')
  }
  cancelarTransaccion() {
    this._clienteService.limpiarVariables();
  }
  recargaLocal() {
    localStorage.setItem('tipoRecarga','recargaLocal');
    this._clienteService.recargaLocal().subscribe( data => {
      let response = data;
      if (response[0].EstadoRecarga === 'APROBADA') {

        this.transaccionAprobada();
      }
    });
  }
  buscarCliente(term: string): void {
    this.flag = true;
    this.busquedaCliente$.next(term);
  }
  onseleccionCliente(ClientObj) {
    if (ClientObj.ClientId !== 0) {
      this._clienteService.getBilleteraClienteId(ClientObj).subscribe( (data) => {})
      this.flag = false;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
