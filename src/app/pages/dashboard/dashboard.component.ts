import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from '../../services/sidebar.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;
  constructor(private _sidebar: UrlService) { }

  ngOnInit( ) {
   /*this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();*/
  }
  ngOnDestroy() {
    /*this.consultarPermisoSubcription.unsubscribe();*/
  }

}
