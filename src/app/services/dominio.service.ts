import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { BehaviorSubject } from 'rxjs';
import { ConstantPool } from '@angular/compiler';
import { Dominio } from 'app/model/dominio';

@Injectable({
  providedIn: 'root'
})
export class DominioService {

  /* Atributos */
  public usuario: string;
  public url: string;
  public dominio: Dominio[] = [];
  private ItemsSource = new BehaviorSubject<Dominio[]>(this.dominio);

  constructor(private _http: Http, private router: Router) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
  }

  consultarDominio(dominio: string) {
    let param1: string = 'dominio';
    // tslint:disable-next-line: max-line-length
    return this._http.get(this.url + 'dominio?' + param1 + '=' + dominio).pipe(map((data) => {
        this.dominio = data.json();
      return this.dominio;
    }, error => console.error('Error al consultar dominio', error)))
  }

}