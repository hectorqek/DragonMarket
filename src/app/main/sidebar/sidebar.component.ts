import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { Menu } from '../../model/menu';
import { Subscription } from '../../../../node_modules/rxjs';

import { AdalService } from '../../../../node_modules/adal-angular4';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
  public urlActual;
  public menuPrincipal: Menu[] = [];
  public menuSuscripcion: Subscription;
  public version: String;


  /** Método  */
  constructor(
    private router: Router,
    private adalSvc: AdalService,
    public _sidebarUrl: UrlService,
    private _router: Router) {
    sessionStorage.getItem('Usuario');
    this.version = GLOBAL.version;
  }
  ngOnInit() {
    this.urlActual = this._sidebarUrl.getPath();
    this.menuSuscripcion = this._sidebarUrl.consultarMenu().subscribe((data) => {
      if (data == null || data.length == 0) {
        this.router.navigate(['/authorization'], { queryParams: { message: "El titular no tiene perfil de acceso" } });
      }
      this.menuPrincipal = data;
    });
  }
  ngOnDestroy() {
    this.menuSuscripcion.unsubscribe();
  }
}





