import { Component, OnInit } from '@angular/core';
import { GLOBAL } from './services/global';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AdalService } from 'adal-angular4';
declare var $: any;
declare function init_plugins();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  Usuario: string;
  resultadoAutorizacion: number;
  Url: string;
// public _itemautorizacionService: AutorizacionService;

  constructor(
    private adalSvc: AdalService) {


    this.adalSvc.init(environment.adalConfig);
    sessionStorage.setItem('Usuario', this.adalSvc.userInfo.userName);

  }

  ngOnInit(): void {
    init_plugins();
    this.Url = GLOBAL.url;
    this.Usuario = sessionStorage.getItem('Usuario');
    this.adalSvc.handleWindowCallback();
  }
}
