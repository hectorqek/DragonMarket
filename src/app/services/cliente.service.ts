import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

// tslint:disable-next-line:max-line-length
import {
  Responsable,
  ResponsableTransaccion
  , ClienteTransaccion
  , MedioPago
  , ResponsableConsulta
  , Cliente
  , ResponsableRedistribucion
  , ClienteTransaccionRedistruccion,
  AdmonClienteConsulta,
  AdmonClienteEditar,
  AdmonClienteCrear,
} from '../model/cliente';


import { Router, Params } from '@angular/router';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { AdalService } from 'adal-angular4';
import { ClienteDevolucion, BolsilloDevolucion, ResponsableDevolucion, DevolucionTransaccion } from '../model/cliente';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

const swal: SweetAlert = _swal as any;

@Injectable()
export class ClienteService {

  public url: string;
  public responsable: Responsable[];
  public ResponsableTransaccion: ResponsableTransaccion[] = [];
  public ClienteTransaccion: ClienteTransaccion[] = [];
  public IdTransaccion: string;
  public ResponsableRedistribucion: ResponsableRedistribucion[] = [];
  public  DevolucionCliente: ResponsableDevolucion[]
  private IdTransaccionResult: boolean = false;
  private getIdTransaccion = new BehaviorSubject<boolean>(this.IdTransaccionResult);
  private usuario: string = sessionStorage.getItem('Usuario');
  private respuestaConfirmacion;
  public cliente: AdmonClienteConsulta[] = [];
  public clienteEditar: AdmonClienteEditar[] = [];

  private sumaLessSource = new BehaviorSubject<number>(0);
  private sumaPlusSource = new BehaviorSubject<number>(0);

  /* Observable */
  public getIdTransaccionSource$ = this.getIdTransaccion.asObservable();
  public getResultSumaLess = this.sumaLessSource.asObservable();
  public getResultSumaPlus = this.sumaPlusSource.asObservable();

  private ItemsSource = new BehaviorSubject<AdmonClienteConsulta[]>(this.cliente);
  public ListaItemService$ = this.ItemsSource.asObservable();

  private mediosPago: MedioPago[] =
    [
      {
        nombreMedioPago: 'Efectivo',
        abrv: 'EFE',
        clase: 'btn-primary'

      },
      {
        nombreMedioPago: 'Tarjeta Debito - Tarjeta de Credito',
        abrv: 'TDC',
        clase: 'btn-success'

      }
    ]
 
  constructor(private _http: Http, private router: Router, private adalSvc: AdalService) {
    this.url = GLOBAL.url;
    sessionStorage.setItem('Usuario', this.adalSvc.userInfo.userName);
  }
  /** Métodos */
  getBilleteraCliente(usuario: string) {
    return this._http.get(this.url + 'billetera?Usuario=' + usuario).pipe(map((respuesta) => {
      this.responsable = respuesta.json();
      let Clientes: Cliente[] = [];
      for (let i = 0; i < this.responsable[0].Clientes.length; i++) {
        let cliente: Cliente;
        let consulstaHistorico: Boolean = false;
        cliente = new Cliente(
          this.responsable[0].Clientes[i].IdCliente,
          this.responsable[0].Clientes[i].ApellidoCliente,
          this.responsable[0].Clientes[i].NombreCliente,
          this.responsable[0].Clientes[i].CursoCliente,
          this.responsable[0].Clientes[i].ImagenCliente,
          this.responsable[0].Clientes[i].TotalSaldoBolsillos,
          consulstaHistorico,
          this.responsable[0].Clientes[i].Bolsillos,
        )
        Clientes.push(cliente);

      }
      let responsable1: ResponsableConsulta[] = [];
      let responsableConsulta: ResponsableConsulta;
      responsableConsulta = new ResponsableConsulta(
        this.responsable[0].TipoIdClienteResponsable,
        this.responsable[0].IdClienteResponsable,
        this.responsable[0].ApellidoResponsable,
        this.responsable[0].NombreResponsable,
        this.responsable[0].UsernameResponsable,
        Clientes
      )
      responsable1.push(responsableConsulta);
      return responsable1;
    }));
  }


  getBilleteraClienteId(idCliente: string) {
    return this._http.get(this.url + 'billetera?idCliente=' + idCliente + '&Usuario=' + this.usuario).pipe(map((respuesta) => {
      this.responsable = respuesta.json();
      return this.responsable;
    }));
  }
  getMediosPago() {
    return this.mediosPago;
  }

  /* Método para realizar recaga */
  limpiarVariables() {
    this.ClienteTransaccion = [];
    this.ResponsableTransaccion = [];
  }

  recarga(recargarTransaccion: ResponsableConsulta[], valorTotalRecarga: number, origen: string, medioPago: string) {
    this.limpiarVariables();
    this.topesMinMax();
    /* Crear un objeto de tipo Responsable Transacción que es que se va a entrar a la vista  */
    let responsableTransaccion: ResponsableTransaccion;
    responsableTransaccion = new ResponsableTransaccion(
      recargarTransaccion[0].TipoIdClienteResponsable,
      recargarTransaccion[0].IdClienteResponsable,
      recargarTransaccion[0].NombreResponsable,
      recargarTransaccion[0].UsernameResponsable,
    );
    this.ResponsableTransaccion.push(responsableTransaccion);
    /* Se aplana la información de Cliente  */
    for (let j = 0; j < recargarTransaccion[0].Clientes.length; j++) {
      for (let k = 0; k < recargarTransaccion[0].Clientes[j].Bolsillos.length; k++) {
        if (recargarTransaccion[0].Clientes[j].Bolsillos[k].ValorRecarga > 0) {
          let clienteTransaccion: ClienteTransaccion;
          clienteTransaccion = new ClienteTransaccion(
            recargarTransaccion[0].Clientes[j].IdCliente,
            recargarTransaccion[0].Clientes[j].IdCliente,
            recargarTransaccion[0].Clientes[j].Bolsillos[k].IdBolsillo,
            recargarTransaccion[0].Clientes[j].Bolsillos[k].NombreBolsillo,
            recargarTransaccion[0].Clientes[j].Bolsillos[k].ValorRecarga,
            origen,
            medioPago
          )
          this.ClienteTransaccion.push(clienteTransaccion);
        }
      }
    }
    let BilleteraClienteResponsableDT = JSON.stringify(this.ResponsableTransaccion);
    let BilleteraClienteDT = JSON.stringify(this.ClienteTransaccion);
    let usuario = sessionStorage.getItem('Usuario');
    this.usuario = usuario;
    // tslint:disable-next-line:max-line-length
    let params: any = 'BilleteraClienteResponsableDT=' + BilleteraClienteResponsableDT +
      '&' + 'BilleteraClienteDT=' + BilleteraClienteDT +
      '&' + 'ValorTotalRecarga=' + valorTotalRecarga + '&' + 'Usuario=' + usuario;
    localStorage.setItem('URLrecarga', this.url + 'bolsillo?' + params);
    return this._http.put(this.url + 'bolsillo?' + params, null)
      .pipe(map(data => {
        let respuesta = data.json();
        if (respuesta.CodigoError === '0') {
          this.IdTransaccionResult = true;
          this.getIdTransaccion.next(this.IdTransaccionResult);
          this.IdTransaccion = respuesta.IdTransaccion;
        }
        return respuesta;
      }
      ));

  }
  redireccionAvisor() {
    let params: any = 'IdTransaccion=' + this.IdTransaccion + '&' + 'Medio=PSE' + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + 'bolsillo?' + params, null)
      .pipe(map((data) => {
        let response = data;
        return response;
      }));
  }
  /** Método Recarga a billetera Local */
  recargaLocal() {
    let params: any = 'IdTransaccion=' + this.IdTransaccion + '&' + 'Validar=validacion' + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + 'bolsillo?' + params, null)
      .pipe(map((data) => {
        let body: string = JSON.parse(data['_body']);
        let response = data.json();
        if (data.status = 200) {
          for (let i = 0; i < response.length; i++) {
            if (response[i].TotalRecarga > 0) {
              /**
               * Guaradar Id en LocalStorage:
               * Se guarda el ID de la transacción en una variable local para usar  en el botón re imprimir última trasnsacción.
              */
              localStorage.setItem('UltimaRecarga', response[0].IdRecarga);
              swal({
                title: 'Recarga Exitosa!',
                text: 'Se realizó exitosamente la recarga!',
                icon: 'success'
              });
              this.router.navigate(['/confirmacion-recarga',this.IdTransaccion]);
            }
            return response;
          }
        } else {
          console.log('Error')
        }

      }));
  }
  confirmacionRecarga(idTransaccion) {
    let params: any = 'IdTransaccion=' + idTransaccion + '&' + 'Usuario=' + this.usuario + '&' + 'Validar=validacion';
    return this._http.get(this.url + 'bolsillo?' + params, null)
      .pipe(map((data) => {
        let response = data.json();
        return response;
      }));
  }
  historialTransacciones(IdCliente?: any) {
    let params: any = 'Bolsillo?' + 'Usuario=' + this.usuario + '&' + 'tipoConsulta=' + 'Recarga' + '&' + 'IdCliente=' + IdCliente;
    return this._http.get(this.url + params).pipe(map((data) => {
      console.log('this.url + params: ', this.url + params);
      let response = data.json();
      console.log('data.json(): ', data.json());
      if (response.length === 0) {
        swal({
          title: 'No tiene transacciones',
          text: IdCliente != null ? 'No se encontraron transacciones realizadas' : 'Usted no ha realizado ninguna transacción para consultar',
          icon: 'warning',
          buttons: [true]
        });
      }
      return response;
    }));
  }

  search(term: string): Observable<any[]> {
    let params: any = 'cliente?Usuario=' + this.usuario + '&' + 'q=' + term;
    let ClientList = this._http.get(this.url + params).pipe(map((r: Response) => {
      return ( r.json().length !== 0 ? r.json() : [{ 'IdCliente': 'ER-001', 'NombreCompleto': 'No hay Registros',  'Imagen': 'assets/images/sinfoto.jpg' }]) as any[]
    }));
    return ClientList;
  }
  /** Método Topes Maximos y Mínimos de recarga */
  topesMinMax() {
    let TipoRecarga: string = 'PSE';
    let params: string = 'ValorRecarga?' + 'TipoRecarga=' + TipoRecarga + '&' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map((data) => {
      let response = data.json();
      return response;
    }));
  }
  verificacionUltimaTransaccion() {
    let params: string = 'Bolsillo?' + 'Usuario=' + this.usuario + '&' + 'tipoConsulta=' + 'UltimaRecarga';
    return this._http.get(this.url + params).pipe(map((data) => {
      let response = data.json();
      return response;
    }));
  }

  /* Métodos Redistribución de Saldos*/
  getResponsableClientes(usuario: string) {
    return this._http.get(this.url + 'billetera?Usuario=' + usuario).pipe(map((respuesta) => {
      this.ResponsableRedistribucion = respuesta.json();
      if (this.ResponsableRedistribucion[0].Clientes.length > 0) {
        for (let j = 0; j < this.ResponsableRedistribucion[0].Clientes.length; j++) {
          for (let k = 0; k < this.ResponsableRedistribucion[0].Clientes[j].Bolsillos.length; k++) {
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorless = 0;
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorplus = 0;
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].SaldoFinal = 0;
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].SaldoFinal =
              Number(this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Saldo
                - this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorless
                + this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorplus
              );
          }
        }
      }

      return this.ResponsableRedistribucion;
    }));
  }
  redistribuirSaldo(ValorTotalOrigen: number, ValorTotalDestino: number) {
    let ResponsableRedistribucionTransaccion: ResponsableTransaccion[] = [];
    let responsableRedistribucionTransaccion: ResponsableTransaccion;
    responsableRedistribucionTransaccion = new ResponsableTransaccion(
      this.ResponsableRedistribucion[0].TipoIdClienteResponsable,
      this.ResponsableRedistribucion[0].IdClienteResponsable,
      this.ResponsableRedistribucion[0].NombreResponsable + ' ' + this.ResponsableRedistribucion[0].ApellidoResponsable,
      this.ResponsableRedistribucion[0].UsernameResponsable,
    );
    ResponsableRedistribucionTransaccion.push(responsableRedistribucionTransaccion);
    let ClienteOrigenRedistribucion: ClienteTransaccionRedistruccion[] = [];
    let ClienteDestinoRedistribucion: ClienteTransaccionRedistruccion[] = [];
    for (let i = 0; i < this.ResponsableRedistribucion[0].Clientes.length; i++) {
      for (let j = 0; j < this.ResponsableRedistribucion[0].Clientes[i].Bolsillos.length; j++) {
        if (this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorless > 0) {
          let clienteOrigenRedistribucion: ClienteTransaccionRedistruccion;
          clienteOrigenRedistribucion = new ClienteTransaccionRedistruccion(
            this.ResponsableRedistribucion[0].Clientes[i].IdCliente,
            this.ResponsableRedistribucion[0].Clientes[i].IdCliente,
            this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].IdBolsillo,
            this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorless,
          );
          ClienteOrigenRedistribucion.push(clienteOrigenRedistribucion);

        }
        if (this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorplus > 0) {
          let clienteDestinoRedistribucion: ClienteTransaccionRedistruccion;
          clienteDestinoRedistribucion = new ClienteTransaccionRedistruccion(
            this.ResponsableRedistribucion[0].Clientes[i].IdCliente,
            this.ResponsableRedistribucion[0].Clientes[i].IdCliente,
            this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].IdBolsillo,
            this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorplus,
          );
          ClienteDestinoRedistribucion.push(clienteDestinoRedistribucion);

        }
      }
    }
    let params: any = 'BilleteraClienteResponsableDT=' + JSON.stringify(ResponsableRedistribucionTransaccion) +
      '&BilleteraClienteOrigen=' + JSON.stringify(ClienteOrigenRedistribucion) + '&ValorTotalOrigen=' + JSON.stringify(ValorTotalOrigen) +
      '&BilleteraClienteDestino=' + JSON.stringify(ClienteDestinoRedistribucion) +
      '&ValorTotalDestino=' + JSON.stringify(ValorTotalDestino) +
      '&Usuario=' + this.usuario;
    return this._http.put(this.url + 'bolsillo?' + params, null).pipe(map((data) => {
      let response = data.json();
      return response;
    }));
  }
  sumavaloresless() {
    let sumaless = 0;
    let saldoFinal = 0;
    for (let i = 0; i < this.ResponsableRedistribucion[0].Clientes.length; i++) {
      for (let j = 0; j < this.ResponsableRedistribucion[0].Clientes[i].Bolsillos.length; j++) {
        if (this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorless > 0) {
          sumaless += Number(this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorless);
        }
      }
    }
    this.sumaLessSource.next(sumaless);
  }
  sumavalorespluss() {
    let sumaplus = 0;
    for (let i = 0; i < this.ResponsableRedistribucion[0].Clientes.length; i++) {
      for (let j = 0; j < this.ResponsableRedistribucion[0].Clientes[i].Bolsillos.length; j++) {
        if (this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorplus > 0) {
          sumaplus += Number(this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorplus);
        }
      }
    }
    this.sumaPlusSource.next(sumaplus);
  }
  calcularsumaValorFinal() {
    let sumaValorFinal = 0;
    for (let i = 0; i < this.ResponsableRedistribucion[0].Clientes.length; i++) {
      for (let j = 0; j < this.ResponsableRedistribucion[0].Clientes[i].Bolsillos.length; j++) {
        sumaValorFinal = Number(this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Saldo)
          - Number(this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorless)
          + Number(this.ResponsableRedistribucion[0].Clientes[i].Bolsillos[j].Valorplus);
      }
    }

  }

  historialRecargas(IdCliente) {
    let params: any = 'billetera?' + 'IdClienteR=' + IdCliente + '&' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map((data) => {
      let response = data.json();
      if (response.length === 0) {
        swal({
          title: 'No tiene transacciones',
          text: 'Usted no ha realizado ninguna recarga para consultar',
          icon: 'warning',
          buttons: [true]
        });
      }
      return response;
    }));
  }
  reversionRecarga(IdRecarga) {
    let params: string = 'bolsillo?' + 'IdRecarga=' + IdRecarga + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      if (response[0].EstadoReversion === 'RECHAZADA') {
        swal('Rervesión Rechazada', 'No se puedo realizar la reversión', 'error');
        this.confirmacionReversion(IdRecarga);
        this.router.navigate(['/principal/confirmacion-reversion/' + IdRecarga]);
      } else if (response[0].EstadoReversion === 'APROBADA') {
        swal('Rervesión Aprobada', 'Reversión Exitosa', 'success');
        this.confirmacionReversion(IdRecarga);
        this.router.navigate(['/principal/confirmacion-reversion/' + IdRecarga]);
      }
      return response;
    }));
  }
  consultaClienteReversion(IdCliente) {
    let params: any = 'billetera?' + 'IdCliente=' + IdCliente + '&' + 'Usuario=' + this.usuario;
    return this._http.get(this.url + params).pipe(map((data) => {
      this.ResponsableRedistribucion = data.json();
      if (this.ResponsableRedistribucion[0].Clientes.length > 0) {
        for (let j = 0; j < this.ResponsableRedistribucion[0].Clientes.length; j++) {
          for (let k = 0; k < this.ResponsableRedistribucion[0].Clientes[j].Bolsillos.length; k++) {
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorless = 0;
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorplus = 0;
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].SaldoFinal = 0;
            this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].SaldoFinal =
              Number(this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Saldo
                - this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorless
                + this.ResponsableRedistribucion[0].Clientes[j].Bolsillos[k].Valorplus
              );
          }
        }
      }
      return this.ResponsableRedistribucion;
    }));
  }
  confirmacionReversion(idTransaccion) {
    let params: any = 'bolsillo?' + 'IdRecarga=' + idTransaccion + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null)
      .pipe(map((data) => {
        let response = data.json();
        return response;
      }));
  }
  /* Consulta de Usuario para Devolucion */

  getClienteDevolucion(IdCliente: string) {
    return this._http.get(this.url + 'billetera?IdClienteA=' + IdCliente + '&' + 'Usuario=' + this.usuario).pipe(map((data) => {
      this.DevolucionCliente = data.json();
      return this.DevolucionCliente;
    }));
  }
  devolucionCliente(devolucionCliente: ResponsableDevolucion[], valorTotalAjuste: number) {
    let origen: string = 'BIL';
    let devolucionesClienteTransaccion: DevolucionTransaccion[] = [];
    for (let i = 0; i < devolucionCliente[0].Clientes[0].Bolsillos.length; i++) {
    if (devolucionCliente[0].Clientes[0].Bolsillos[i].ValorAjuste > 0) {
        let devolucionClienteTransaccion: DevolucionTransaccion;
        devolucionClienteTransaccion = new DevolucionTransaccion(
          devolucionCliente[0].Clientes[0].IdCliente,
          devolucionCliente[0].Clientes[0].IdCliente,
          devolucionCliente[0].Clientes[0].Bolsillos[i].IdBolsillo,
          origen,
          devolucionCliente[0].Clientes[0].Bolsillos[i].Nota);
        devolucionesClienteTransaccion.push(devolucionClienteTransaccion);
      }
    }
    // tslint:disable-next-line:max-line-length
    let params: any = this.url + 'bolsillo?' + 'BilleteraClienteDT=' + JSON.stringify(devolucionesClienteTransaccion) + '&' + 'ValorTotalAjuste=' + valorTotalAjuste + '&' + 'Usuario=' + this.usuario;
    return this._http.put(params, null).pipe(map((data) => {
      let response = data.json();
      let IdAjuste = response[0].IdTransaccion;
      let listadoErrores: any[] = [];
      for (let i = 0; i < response.length; i++) {
        if (response[i].CodigoError === '"R0000"') {
          this.confirmacionDevolucion(IdAjuste);
          this.router.navigate(['/principal/confirmacion-devolucion/' + IdAjuste]);
        } else {
        let tmp2: any[] = [];
        tmp2.push(response[i].CodigoError);
        tmp2.push(response[i].IdTransaccion);
        listadoErrores.push(tmp2);
        }
      }
      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Devolución Saldo');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return response;
    },
    error => console.error('Error', error)

  ))}
  confirmacionDevolucion(IdAjuste: number) {
    let params: any = this.url + 'bolsillo?' + 'IdAjuste=' + IdAjuste + '&' + 'Usuario=' + this.usuario;
    return this._http.get(params, null).pipe(map((data) => {
      let response =  data.json();
      return response;
    }));
  }


  consultarAdmonCliente(busqueda: string, estado: number) {
    console.log("consultarAdmonCliente");
    let param1: string = 'busqueda';
    let param2: string = 'estado';
    let param3: string = 'userName';
    // tslint:disable-next-line: max-line-length
    return this._http.get(this.url + 'cliente/consultarTitular?' + param1 + '=' + busqueda + '&' + param2 + '=' + estado + '&' + param3 + '=' + this.usuario).pipe(map((data) => {
        this.cliente = data.json();
        console.log("aaaaa",this.cliente);
        this.ItemsSource.next(data.json());
      return this.cliente;
    }, error => console.error('Error al consultar clientes', error)))
  }

  consultarAdmonClienteParaModificar(idCliente: string) {
    let param1: string = 'idCliente';
    let param3: string = 'userName';
    // tslint:disable-next-line: max-line-length
    return this._http.get(this.url + 'cliente/consultarClienteEditar?' + param1 + '=' + idCliente + '&' + param3 + '=' + this.usuario).pipe(map((data) => {
      console.log('asas', data.json());
      let response = data.json();
      console.log('clienteEditar', response);
      return response;
    }, error => console.error('Error al consultar clientes', error)))
  }


  crearCliente(clienteCrear: AdmonClienteCrear) {
    let params: any = 'cliente/agregarCliente?' + 'cliente=[' + JSON.stringify(clienteCrear) + ']&' +
      'userName=' + this.usuario;
      console.log(params);
      return this._http.post(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      if (response.MensajeError === 'ADC0000') {
        swal('Crear Cliente', 'Creación exitosa.', 'success');
      }
      if (response.MensajeError === 'ADT9999') {
        swal('Crear Cliente', 'Ocurrio un error.', 'error');
      }
      if (response.MensajeError === 'ADT0001') {
        swal('Crear Cliente', 'Cliente ya existe.', 'warning');
      }
    this.consultarAdmonCliente(localStorage.getItem("busqCliente"), parseInt(localStorage.getItem("estCliente"))).subscribe();
    return response;
    }))
  }

  editarCliente(clienteEditar: AdmonClienteEditar) {
    let params: any = 'cliente?' + 'cliente=[' + JSON.stringify(clienteEditar) + ']&' +
      'userName=' + this.usuario;
      console.log(params);
      return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      if (response.MensajeError === 'ADC0000') {
        swal('Edición Cliente', 'Modificación exitosa.', 'success');
      }
      if (response.MensajeError === 'ADT9999') {
        swal('Edición Cliente', 'Ocurrio un error.', 'error');
      }
      if (response.MensajeError === 'ADT0001') {
        swal('Edición Cliente', 'Cliente ya existe.', 'warning');
      }
      this.consultarAdmonCliente(localStorage.getItem("busqCliente"), parseInt(localStorage.getItem("estCliente"))).subscribe();
    return response;
    }))
  }



}



