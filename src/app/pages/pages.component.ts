import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventarioService } from '../services/inventario.service';
import { UrlService } from '../services/sidebar.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {
  constructor(private _sidebar: UrlService) { }

  ngOnInit() {
  }

}
