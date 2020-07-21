import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantPool } from '@angular/compiler';
import { Titular, TitularCrear } from 'app/model/titular';


@Injectable({
  providedIn: 'root'
})
export class TitularService {

  /* Atributos */
  public usuario: string;
  public url: string;
  public titular: Titular[] = [];
  private ItemsSource = new BehaviorSubject<Titular[]>(this.titular);
  public ListaTitularService$ = this.ItemsSource.asObservable();

  constructor(private _http: Http, private router: Router) {
    this.url = GLOBAL.url;
    this.usuario = sessionStorage.getItem('Usuario');
  }

  consultarTitular(busqueda: string, estado: number) {
    let param1: string = 'busqueda';
    let param2: string = 'estado';
    let param3: string = 'userName';
    // tslint:disable-next-line: max-line-length
    return this._http.get(this.url + 'titular/consultarTitular?' + param1 + '=' + busqueda + '&' + param2 + '=' + estado + '&' + param3 + '=' + this.usuario).pipe(map((data) => {
        this.titular = data.json();
        this.ItemsSource.next(data.json());
      return this.titular;
    }, error => console.error('Error al consultar titulares', error)))
  }

  search(busqueda: string): Observable<any[]> {
    let param1: string = 'busqueda';
    let param2: string = 'estado';
    let param3: string = 'userName';
    
    let params: any = 'titular/consultarTitular?' + param1 + '=' + busqueda + '&' + param2 + '=' + '1' + '&' + param3 + '=' + this.usuario
    console.log('params: ', params);
    let ClientList = this._http.get(this.url + params).pipe(map((r: Response) => {
      return ( r.json().length !== 0 ? r.json() : [{ 'IdCliente': 'ER-001', 'NombreCompleto': 'No hay Registros',  'Imagen': 'assets/images/sinfoto.jpg' }]) as any[]
    }));
    console.log('ClientList: ', ClientList);
    return ClientList;
    
  }

  consultarTitularParaEditar(tipoIdentificacion: string, numeroIdentificacion: string) {
    let param1: string = '?tipoIdentificacion=';
    let param2: string = '&numeroIdentificacion=';
    let param3: string = '&userName=';
    // tslint:disable-next-line: max-line-length
    return this._http.get(this.url + 'titular/consultarTitularEditar' + param1 + tipoIdentificacion + param2 + numeroIdentificacion +  param3 + this.usuario).pipe(map((data) => {
      let item = data.json();
      return item;
    }, error => console.error('Error al consultar ItemVenta', error)))
  }

  crearTitular(titular: TitularCrear) {
    let params: string = 'titular?' + 'titular=[' + JSON.stringify(titular) + ']&' + 'userName=' + this.usuario;
    return this._http.post(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      console.log('titular', response);
      this.consultarTitular(localStorage.getItem("busqTitular"), parseInt(localStorage.getItem("estTitular"))).subscribe();
      return response;
    }))
  }

  editarTitular(titular: TitularCrear) {
    // let productoEditarU: TitularCrear;
    // let productoEditar: TitularCrear;
    // productoEditar = new TitularCrear(
    //   titular.TipoIdClienteResponsable,
    //   titular.IdClienteResponsable,
    //   titular.Nombres,
    //   titular.Apellidos,
    //   titular.Username,
    //   titular.Estado
    // )

    let params: string = 'titular?' + 'titular=[' + JSON.stringify(titular) + ']&' + 'userName=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      if (response.MensajeError === 'ADT0000') {
        swal('Editar Titular', 'Modificación exitosa', 'success');
      }
      if (response.MensajeError === 'ADT0002') {
        swal('Editar Titular', 'El correo electrónico ya esta asociado a otro titular.', 'error');
      }
      if (response.MensajeError === "ADT0001") {
        swal('Editar Titular', 'Ya existe titular con tipo y número de identificación.', 'error');
      }
      if (response.MensajeError === "ADT9999") {
        swal('Editar Titular', 'Ocurrio un error.', 'error');
      }
      this.consultarTitular(localStorage.getItem("busqTitular"), parseInt(localStorage.getItem("estTitular"))).subscribe();
      return response;
    }))
  }
}