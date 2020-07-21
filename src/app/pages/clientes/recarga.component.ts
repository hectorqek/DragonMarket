import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Responsable, Cliente, MedioPago, ResponsableConsulta } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';
import { PersonaBilletera } from '../../model/PersonaBilletera';
import { GLOBAL } from '../../services/global';
import { Subscription } from 'rxjs';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Router } from '@angular/router';
import { AdalService } from 'adal-angular4';
import { UrlService } from 'app/services/sidebar.service';



// First, you need to create the `numberMask` with your desired configurations
declare var $: any;
@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html'
})
export class RecargaComponent implements OnInit, OnDestroy {
  public myModel = ''
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public numberMask = createNumberMask({
  prefix: '',
  suffix: '' // This will put the dollar sign at the end, with a space.
})

  public responsableDatos: ResponsableConsulta[];
  public infoCliente;
  public SumaRecarga: number;
  public SumaRecarga1: number;
  public cliente: PersonaBilletera[];
  public url: string;
  public mayor0: boolean = false;
  private getIdTransaccionResultSub: Subscription;
  private sendRecarga: Subscription;
  public MedioPago: MedioPago[] = [];
  public mascara: boolean = false;
  public usuario: string;
  public usuarioLogin: string;
  public verBtnRecarga = false;
  public isLoading: boolean;
  public verResumenRecarga = false;
  public topeMin: number;
  public topeMax: number;
  public pendienteTransaccion: boolean = false;
  public reporteUrlExtracto: string;
  public reporteUrlConsumo: string;
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;
  public fechaInicio: Date;
  public fechaFin: Date;

  /* Método Constructor */
  constructor (
    private _clienteService: ClienteService,
    private router: Router,
    private adalSvc: AdalService,
    private _sidebar: UrlService) {
    this.url = GLOBAL.url;
    this.usuarioLogin = this.adalSvc.userInfo.userName;
    sessionStorage.setItem('UsuarioLogin', this.usuarioLogin);

  }
  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.consultaBilletera();
    this.SumaRecarga = 0;
    this.MedioPago = this._clienteService.getMediosPago();
    this.isLoading = false;
    this.topesMinMax();
    this.isLoading = true;
    this._clienteService.verificacionUltimaTransaccion().subscribe( data => {
      if (data.length > 0) {
        if ( data[0].Estado  === 'PENDIENTE') {
          let labelMensaje = ' En este momento hay una recarga en estado pendiente por lo que no se permite realizar nuevas recargas ';
          swal('Transacción Pendiente', labelMensaje, 'warning');
          this.pendienteTransaccion = true;
        } else {
        }
      }
    })
  }
  consultaHistorico(nombreReporte: String, idCliente: String ) {
    // tslint:disable-next-line:max-line-length
    let urlReporte = nombreReporte + '&' + 'sP_idCliente=' + idCliente + '&' + 'dP_FechaInicio=' + this.fechaInicio + '&' + 'dP_FechaFin=' + this.fechaFin;
    window.open(GLOBAL.urlReportes + urlReporte, '_blank');
  }

  consultaBilletera() {
    this._clienteService.getBilleteraCliente(this.usuarioLogin).subscribe( data => {
      this.responsableDatos = data;
        /* Se aplana la información de Cliente  */
      if (this.responsableDatos[0].Clientes.length > 0) {
        for (let j = 0; j < this.responsableDatos[0].Clientes.length; j++) {
          for (let k = 0; k < this.responsableDatos[0].Clientes[j].Bolsillos.length; k++) {
            this.responsableDatos [0].Clientes[j].Bolsillos[k].ValorRecarga = 0;
            this.SumaRecarga += Number(this.responsableDatos[0].Clientes[j].Bolsillos[k].ValorRecarga);
          }
        }
        this.infoCliente = this.responsableDatos[0].Clientes;
        this.verResumenRecarga = true;
        this.isLoading = false;
      }
    });
  }
  actualizarValorTotal(valor: any) {
    if (valor.Clientes.length > 0) {
      this.SumaRecarga1 = 0
      for (let j = 0; j < valor.Clientes.length; j++) {
        for (let k = 0; k < valor.Clientes[j].Bolsillos.length; k++) {
         // valor.Clientes[j].Bolsillos[k].ValorRecarga = 0;
         this.SumaRecarga1 += Number(valor.Clientes[j].Bolsillos[k].ValorRecarga);
          this.SumaRecarga = this.SumaRecarga1;
        }
      }
    }
  }
  recarga(arregloInicial: ResponsableConsulta, valorTotalRecarga: number, origen: string, medioPago: string) {
    let valor: Responsable;
    valor = new Responsable(
      arregloInicial.TipoIdClienteResponsable,
      arregloInicial.IdClienteResponsable,
      arregloInicial.ApellidoResponsable,
      arregloInicial.NombreResponsable,
      arregloInicial.UsernameResponsable,
      arregloInicial.Clientes
    )
    let valores: Responsable [] = [];
    valores.push(valor);
    for (let j = 0; j < valores[0].Clientes.length; j++) {
      for (let k = 0; k < valores[0].Clientes[j].Bolsillos.length; k++) {
        if (valorTotalRecarga >= this.topeMin && valorTotalRecarga <= this.topeMax ) {
          this.isLoading = false;
          this.mayor0 = true;
          this.sendRecarga = this._clienteService.recarga(valores, valorTotalRecarga, origen, medioPago ).subscribe( respuesta => {
            if (respuesta.CodigoError === '0' ) {
              if ( origen === 'PSE') {
                this.isLoading = true;
                localStorage.setItem('tipoRecarga', 'PSE');
                this.redireccionPSE();
              }
            }
          });
          valores = [];
          this.SumaRecarga = 0;
        }else {
          let labelMensaje = 'El valor de recarga minimo es: $' + this.topeMin + ' y maximo $' + this.topeMax;
          swal('Error en los Valores de Recarga', labelMensaje, 'warning');
        }
      }
    }
  }
  redireccionPSE() {
    this._clienteService.redireccionAvisor()
    .subscribe( data => {
      let body: string = JSON.parse(data['_body']);
      if (body !== 'Ha ocurrido un error de comunicación con el servidor') {
        this.router.navigate(['/']).then(result => { window.location.href = body; });
      }else{
        this.isLoading = false;
        swal('Ecollect no disponible', 'En este momento el sistema de recargas, no está disponible. Por favor intente más tarde.', 'warning');
      }
    });
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
    this._clienteService.recargaLocal().subscribe( data => {
      let response = data;
      if (response[0].EstadoRecarga === 'APROBADA') {
        this.transaccionAprobada();
      }
    });
  }
  topesMinMax() {
    this._clienteService.topesMinMax().subscribe( data => {
      this.topeMin = data[0].ValorMinimoRecarga;
      this.topeMax = data[0].ValorMaximoRecarga;
    });
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
