import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { PosService } from '../../services/pos.service';
import { TirillaCierre } from '../../model/pos';
import { Subscription } from '../../../../node_modules/rxjs';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router } from '../../../../node_modules/@angular/router';
import { UrlService } from '../../services/sidebar.service';

const swal: SweetAlert = _swal as any;
declare var $: any;

@Component({
  selector: 'app-cierre-pos',
  templateUrl: './cierre-pos.component.html'
})
export class CierrePosComponent implements OnInit, OnDestroy {
  public TirillaCierre: TirillaCierre;
  public _datosPerdiodoTrabajoSubscription: Subscription;
  public IdPeriodoTrabajo: number;
  public IdConsecutivo: number;
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;
  constructor(private _posService: PosService,
              private router: Router,
              private _sidebar: UrlService) { }

  ngOnInit(
  ) {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.consultaIdPeriodoTrabajo();
    this.consultaTirillaCierre();
}

  consultaIdPeriodoTrabajo() {
      this._posService.infoPOSService$.subscribe( (data) => {
        this.IdPeriodoTrabajo = data.IdPeriodoTrabajo;
        this.IdConsecutivo = data.IdConsecutivo;
    })
  }
  consultaTirillaCierre() {
    if (this.IdPeriodoTrabajo !== undefined) {
      this._posService.tirillaCierre(this.IdPeriodoTrabajo, this.IdConsecutivo).subscribe( (data) => {
        this.TirillaCierre = data;
    });
    } else {
        swal({
          title: 'Periodo Trabajo Inactivo',
          text:  'No existe un Periodo de Trabajo Activo, debe Abrir POS para generar tirilla de cierre',
          icon:  'error',
          });
        this.router.navigate(['/pos/abrir']);
    }
  }
  imprimir() {
    let printContents, popupWin;
           printContents = document.getElementById('print-section').innerHTML;
           popupWin = window.open('', '_blank', 'height=100px,width=100px');
           popupWin.document.open();
           popupWin.document.write(`
             <html>
               <head>
                 <title>Recibo de Pago</title>
                 <style>
                 html, body
                   {
                   width: 400px;
                   font-family: Arial, Helvetica, sans-serif;
                   font-size:9px;
                   font-style: normal;
                   }
                   p {
                     text-align: left;
                     line-height: 0.7px;
                     font-style: normal;
                     font-size:9px;
                   }
                   h1 {
                    text-align: left;
                    font-size: 16px;
                   }
                   .legal {
                     text-align: center;

                 }
                 </style>
               </head>
             <body onload="window.print(),window.close()">
               <h1>COLEGIO SAN JORGE DE INGLATERRA</h1>
               <hr>

                <p> ${printContents}</p>
               <hr>
             </body>
             </html>`
           );
           popupWin.document.close();
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
