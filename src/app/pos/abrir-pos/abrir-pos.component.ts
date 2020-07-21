import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { PosService } from '../../services/pos.service';
import { InformacionPOS, ListadoPOS } from '../../model/pos';
import { Router } from '../../../../node_modules/@angular/router';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { UrlService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs/internal/Subscription';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-abrir-pos',
  templateUrl: './abrir-pos.component.html'
})

export class AbrirPosComponent implements OnInit, OnDestroy {
  public menu: any;
  public infoPOS: InformacionPOS;
  public idPOS
  public nombrePOS: string;
  private consultarPermisoSubcription: Subscription;
  public mostrarFooter: boolean;
  public POSAbierto: boolean;
  public isLoading: boolean = false;

  /* Métodos */
  constructor(private _posService: PosService, private router: Router, private _sidebar: UrlService) {
    this.mostrarFooter = false;
    this.POSAbierto = false;
    this.idPOS =  Number(localStorage.getItem('idPOS'));
   }

  ngOnInit() {
   this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
   this.listadoPOS();
   this.consultarVinculoPOS();

  }

  consultarEstadoPOS() {
    this._posService.estadoPOS().subscribe( (data) => {
        this.infoPOS = data;
      if (this.infoPOS.Estado === 'CERRADO') {
        this.mostrarFooter = false;

      } else if (this.infoPOS.Estado === 'ABIERTO') {
        this.mostrarFooter = true;
        this.POSAbierto = true;
        this.continuarSesion();
      }
    });
  }
  consultarVinculoPOS() {
    if ( this.idPOS === 0 ) {
      let labelMensaje = 'Esta Maquina no se encuentra vinculada a un POS, por favor comuniquese con la mesa de ayuda. Gracias ';
      swal('Maquina No Vínculada a POS', labelMensaje, 'warning');
      this.router.navigate(['/']);
    } else {
      this.consultarEstadoPOS();
    }
  }
  consultarMenusPOS () {
    this._posService.consultarMenu().subscribe ( (data) => {
      this.menu = data.DataArray;
    })
  }
  continuarSesion() {
    this.router.navigate(['/pos/seleccionar-cliente']);
  }
  cerrarPOS(IdPeriodoTrabajo) {
    this._posService.cerrarPOS(IdPeriodoTrabajo).subscribe( x => {
    });
    this.infoPOS = null;
  }
  seleccionAbrir() {
      this._posService.abrirPOS(null).subscribe( (data) => {
        let response = data;
        this.consultarEstadoPOS();
        if (response[0].CodigoError === 'P0001') {
        } else if (response[0].CodigoError === 'P0002') {
          this.consultarMenusPOS();
        }
    });
  }
  listadoPOS() {
    this._posService.listadoPOS().subscribe(
      (response: ListadoPOS[]) => {
        for (let i = 0; i < response.length; i++ ) {
          if (response[i].IdPos === this.idPOS) {
              this.nombrePOS = response[i].NombrePos;
          }

        }
      }
    )
  }
  seleccionAbrirMenuPOS(IdMenu) {
      this._posService.abrirPOS(IdMenu).subscribe( (data) => {
        let response = data;
        this.consultarEstadoPOS();
    });
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
