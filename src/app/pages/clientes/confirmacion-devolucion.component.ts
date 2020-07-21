import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ClienteService } from 'app/services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmacionReversion } from 'app/model/cliente';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ConfirmacionDevolucion } from '../../model/cliente';

@Component({
  selector: 'app-confirmacion-devolucion',
  templateUrl: './confirmacion-devolucion.component.html',

})
export class ConfirmacionDevolucionComponent implements OnInit {

  public id: number;
  public confirmacionDevolucion: ConfirmacionDevolucion;
  public isLoading: boolean;

  @ViewChild('confirmacionDevolucion') content: ElementRef;
  constructor(private _clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private _router: Router,
            ) {
              this.id = this.activatedRoute.snapshot.params['IdAjuste'];
              this.isLoading = false;
            }
  ngOnInit() {
    this._clienteService.confirmacionDevolucion(this.id).subscribe( data => {
      this.confirmacionDevolucion = data;
    });
  }

  Regresar() {
    this._router.navigate(['/']);
  }
  Imprimir() {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,width=400,height=700');
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
            height: 200px;
            font-size:16px;
            font-style: normal;
            }
            p {
              text-align: left;
              line-height: 0.7px;
              font-style: normal;
            }
            h1 {
             text-align: left;
             font-size: 17px;
            }
            .resumen {
              font-size: 14px;
            }
            .titulos {
              font-size: 14px;
            }
            .legal {
              text-align: center;

          }
          </style>
        </head>
      <body onload="window.close()">
        <h1>COLEGIO SAN JORGE DE INGLATERRA</h1>
        <hr>
         ${printContents}
        <p class="legal"><strong>Devolución Realizada</strong></p>
      </body>
      </html>`
    );
  }
}
