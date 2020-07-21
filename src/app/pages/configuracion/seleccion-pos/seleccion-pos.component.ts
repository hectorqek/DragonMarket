import { Component, OnInit, OnDestroy } from '@angular/core';
import { PosService } from '../../../services/pos.service';
import { UrlService } from '../../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seleccion-pos',
  templateUrl: './seleccion-pos.component.html'
})
export class SeleccionPosComponent implements OnInit, OnDestroy {
  public listaPOS: any[];
  public vinculado: string = 'No';
  public idPOSlocal = Number(localStorage.getItem('idPOS'));
    /* Subcriptions */
    private consultarPermisoSubcription: Subscription;
  constructor (
    private _posService: PosService,
    private _sidebar: UrlService) { }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.listarPOS();
 
  }
  listarPOS() {
    this._posService.estadosPOS().subscribe( data => {
      this.listaPOS = data;
     });
  }
  guardarPOS(idPOS) {
    localStorage.setItem('idPOS', idPOS);
  }
  consultarPOS() {
    localStorage.removeItem('idPOS');
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
