import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import { Subscription } from '../../../../node_modules/rxjs';
import { UrlService } from '../../services/sidebar.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare var $: any;

@Component({
  selector: 'app-confirmacion-venta',
  templateUrl: './confirmacion-venta.component.html'
})
export class ConfirmacionVentaComponent implements OnInit {
  public id: string;
  public confirmacionRecarga;
  public isLoading: boolean;
  public verBotonConsulta: boolean = false;

  @ViewChild('confirmacionVenta') content: ElementRef;
  constructor(private _clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private _router: Router,
            ) {
              if (localStorage.getItem('tipoRecarga') !== 'PSE') {
                this.verBotonConsulta = true;
              }
              this.id = this.activatedRoute.snapshot.params['IdTransaccion'];
              this.isLoading = false;
            }
  ngOnInit() {
    this._clienteService.confirmacionRecarga(this.id).subscribe( data => {
      this.confirmacionRecarga = data;
    });
   }

  Regresar() {
    this._router.navigate(['principal/consultar-clientes']);
  }
 
  creacionRecibo(){
    let printContents = document.getElementById('print-section').innerHTML;
    localStorage.setItem('impresionRecarga', `
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
        <p class="legal"><strong>Gracias por su Recarga</strong></p>
      </body>
      </html>`
    );

  }
  Imprimir() {
    let popupWin;
    popupWin = window.open('', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,width=400,height=700');
    popupWin.document.open();
    this.creacionRecibo();
    popupWin.document.write(localStorage.getItem('impresionRecarga'));

  }

}
