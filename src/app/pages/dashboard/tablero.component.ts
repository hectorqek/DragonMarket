import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from '../../services/sidebar.service';
import { Subscription } from '../../../../node_modules/rxjs';
import {DashboardService} from '../../services/dashboard.service';
import {tipoTablero} from './tipostablero'
//import {TableroCantidad} from '../../model/Tablero'

@Component({
  selector: 'app-dashboard',
  templateUrl: './tablero.component.html'
})

export class TableroComponent implements OnInit,OnDestroy{
  constructor(private _sidebar: UrlService,private _dashboard:DashboardService) { }
  ngOnInit(){
    let cantTransaccionTablero=new tipoTablero(this._sidebar,this._dashboard);
    let cantBodegaTablero=new tipoTablero(this._sidebar,this._dashboard);
    let cantKioscoTablero=new tipoTablero(this._sidebar,this._dashboard);
    cantTransaccionTablero.mapearData (1,'trx','transaccion','Transacciones en N Minutos POS','line','Tiempo','Cantidad');
    cantKioscoTablero.mapearData(0,'cant','kiosco','Cantidades por Kiosco','horizontalBar','Saldo Actual','Cantidad Maxima');
    cantBodegaTablero.mapearData(1,'cant','bodega','Cantidades Bodega','horizontalBar','Saldo Actual','Cantidad Maxima');    
  } 
  ngOnDestroy() {
    
  } 
}