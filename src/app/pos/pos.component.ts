import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemVenta } from '../model/ItemVenta';
import { Router } from '@angular/router';
import { PosService } from '../services/pos.service';
import { InformacionPOS } from '../model/pos';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../model/usuario';
import { UrlService } from '../services/sidebar.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Location, LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit, OnDestroy {

  /*public itemVentaSeleccionadoPOS: ItemVenta;
  public cantidadSeleccionda: number;
  public idClienteSeleccionado: string;*/
  public idCategoriaSeleccionada: number = 1;
  public Url: string;
  public infoPOS: InformacionPOS;
  public IdPeriodoTrabajo: Number;
  public infoUsuario: Usuario;
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;

  constructor(
    private router: Router,
    private _posService: PosService,
    private _usuarioService: UsuarioService,
    private _sidebar: UrlService,
    private location: LocationStrategy

  ) {


  }
  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.consultaUsuario();
    this.consultarEstadoPOS();

  }
  consultarEstadoPOS() {
    this._posService.infoPOSService$.subscribe((data) => {
      this.infoPOS = data;
    })
  }
  consultaUsuario() {
    this._usuarioService.getInfoUsuario().subscribe(infoUsuario => {
      this.infoUsuario = infoUsuario;
    });
  }
  categoriaSeleccionada(idCat: number) {
    this.idCategoriaSeleccionada = idCat;
  }
  canDeactivate(): Promise<boolean> | boolean {
    return window.confirm('Esta seguro que quiere salir?');
  }
  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
  }
}
