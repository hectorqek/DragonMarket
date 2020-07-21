import { Component, OnInit } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { PersonaBilleteraService } from '../../services/PersonaBilletera';
import { PersonaBilletera } from '../../model/PersonaBilletera';
import { FormControl } from '@angular/forms';
import { GLOBAL } from '../../services/global';
import { Http } from '@angular/http'
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var $: any;
declare function init_plugins();

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [PersonaBilleteraService]
})
export class HeaderComponent implements OnInit {

  titulo: string;
  usuario: any;
  resultados$: Observable<any>;
  public infoUsuario: Usuario;
  public campoBusqueda: FormControl;
  public idCliente: string;
  public personaB: PersonaBilletera[];
  url: any;
  constructor(
    private router: Router,
    private adalSvc: AdalService,
    private _personaBilletaService: PersonaBilleteraService,
    private _usuarioService: UsuarioService,
    private _http: Http) {
    init_plugins();
    this.campoBusqueda = new FormControl();
    this.url = GLOBAL.url;
    this.resultados$ = this.campoBusqueda.valueChanges
      .pipe(debounceTime(500))
      .pipe(switchMap(query => this._http.get(`${this.url}cliente?Usuario=${this.usuario}&Busqueda=${query}`)))
      .pipe(map(response => response.json()))
  }

  ngOnInit() {
    this.titulo = 'Dragon Market'
    this._usuarioService.getInfoUsuario().subscribe(infoUsuario => {
      if (infoUsuario == null || infoUsuario == undefined) {
        this.router.navigate(['/authorization'], { queryParams: { message: "El titular se encuentra inactivo" } });
      }else {
        // if(infoUsuario == ""){
        //   this.router.navigate(['/authorization'], { queryParams: { message: "El titular no se encuentra" } });
        // }
        if(infoUsuario[0].Estado == 'Inactivo'){
          this.router.navigate(['/authorization'], { queryParams: { message: "El titular se encuentra inactivo" } });
        }
      }
      this.infoUsuario = infoUsuario;
    });
  }
  ValidarCliente(id: string) {
    this.idCliente = id;
  }
}




