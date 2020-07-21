import { Component, OnInit, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PersonaBilletera } from '../../../model/PersonaBilletera';
import { PersonaBilleteraService } from '../../../services/PersonaBilletera';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AutorizacionService } from '../../../services/Autorizacion.service';
import { PosService } from '../../../services/pos.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms'


import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { AdalService } from 'adal-angular4';
import { InformacionPOS } from '../../../model/pos';
import { UrlService } from '../../../services/sidebar.service';

declare var $: any;
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-seleccion-cliente',
  templateUrl: './seleccion-cliente.component.html'
})
export class SeleccionClienteComponent implements OnInit, OnDestroy {

  Usuario: string;
  resultadoAutorizacion: number;
  Url: string;
  public idCliente: string ;
  public personaB: PersonaBilletera[];
  public clienteInvalido: boolean = false;
  @Output() clienteValidoPOS: EventEmitter<boolean>;
  public clienteValido: boolean = false;
  public infoPOS: InformacionPOS;
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;


   constructor( private _personaBilletaService: PersonaBilleteraService,
                private router: Router,
                private _posService: PosService,
                private _sidebar: UrlService) {}

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.Usuario = sessionStorage.getItem('Usuario');
    this.Url = window.location.href;
    this.focusIngresarCliente();
    this.consultarEstadoPOS();
    this.LimpiarCampo();

  }
  consultarEstadoPOS() {
    this._posService.infoPOSService$.subscribe( (data) => {
      this.infoPOS = data;
    })
  }
  ValidarCliente(id: string) {
    this.idCliente = id;
    this._personaBilletaService.getBilleteraPersonaId(id).subscribe(
      result => {
        this.personaB = result;
        this._personaBilletaService.infClienteValidado(this.personaB);
        if (this.personaB.length > 0 ) {
          this.router.navigate(['/pos/venta']);
        } else {
          this.clienteInvalido = true;
          if (this.clienteInvalido === true ) {
            this.LimpiarCampo();
            this.focusIngresarCliente();
          }
        }
      });
   }

   reImprimir(){
    let printContents, popupWin, infoCliente;
    popupWin = window.open('', '_blank', 'height=1,width=1');
    popupWin.document.open();
    popupWin.document.write(localStorage.getItem('impresionVenta'));
    popupWin.document.close();
   }

  focusIngresarCliente() {
    $('#identificacionCliente').focus();
  }
  LimpiarCampo() {
    $('#identificacionCliente').val('');
    $('#identificacionCliente').focus();
  }
  cerrarPOS(IdPeriodoTrabajo) {
    this._posService.cerrarPOS(IdPeriodoTrabajo).subscribe();
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
