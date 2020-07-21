import { Component, OnInit } from '@angular/core';
import { Roles } from 'app/model/roles';
import { RolesService } from 'app/services/roles.service';
import { UsuarioRoles } from 'app/model/UsuarioRoles';
import { Subscription, Subject, Observable } from 'rxjs';

import { HistorialRecarga, HistorialTransaccion } from '../../../model/cliente';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { TitularService } from 'app/services/titular.service';
import { UrlService } from 'app/services/sidebar.service';
import { ClienteService } from 'app/services/cliente.service';


declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  public roles: Roles[] = [];
  public registros: UsuarioRoles[] = [];
  public rol: string | number;
  public login: string;
  public idUsuario: number;
  public rolEditar: string;
  public loginEditar: string;
  public rolCrear: string;
  public loginCrear: string;
  public flagBuscar: boolean;
  public usuario: string;
  public flag: boolean = false;
  public flagCrear: boolean = false;
  public flagEditar: boolean = false;
  public clients: Observable<any[]>
  private busquedaCliente$ = new Subject<string>();
  public Cliente: UsuarioRoles;
  public ClienteMail: string;
  public ClienteMailCrear: string;
  public ClienteMailEditar: string;
  public ClientName: string = '';
  public ClientNameCrear: string = '';
  public ClientNameEditar: string = '';
  public usuarioMessage: string = 'Ingrese el nombre del usuario';
  public usuarioMessageCrear: string = 'Ingrese el nombre del usuario';
  public usuarioMessageEditar: string = 'Ingrese el nombre del usuario';
  public ClienteRolEditar: string;
  public ClienteRolCrear: string = '0';
  public rolDef: string | number;
  public ClienteMailDef: string;


  constructor(private _RolesService: RolesService, _clienteService: ClienteService,
    private _sidebar: UrlService,
    private _titularService: TitularService) {
    this.flagBuscar = false;
    this.usuario = sessionStorage.getItem('Usuario');
    // this.roles.push({IdRol: 1, NombreRol: '1', TipoRol: null}, {IdRol: 2, NombreRol: '2', TipoRol: null});
    // this.registros.push({IdAsignacion: 1,
    //   IdUsuario: 20,
    //   IdRol: 3,
    //   Nombre: 'Andrés Borbón',
    //   Login: 'andres.borbon@sgs.edu.co',
    //   NombreRol: 'Desarrollador'});
  }

  ngOnInit() {
    this.consultarRol();
    this.clients = this.busquedaCliente$
      .pipe(debounceTime(300))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(term => term
        ? this._titularService.search(term)
        : of<any[]>([])))
      .pipe(catchError(error => {
        console.log(error);
        return of<any[]>([]);
      }));
    console.log('this.clients: ', this.clients);
  }

  consultarRol() {
    this._RolesService.consultarRol().subscribe(
      res => {
        this.roles = res;
        console.log('this.roles', this.roles)

      }, err => {
        // swal('Administración Roles Usuario', 'Error al consultar Roles.', 'warning');
        console.log('Error consultar Roles.');
      });
  }

  buscarCliente(term: string): void {
    this.flag = true;
    this.busquedaCliente$.next(term);
  }

  buscarClienteCrear(term: string): void {
    console.log('term', term)
    this.flagCrear = true;
    this.busquedaCliente$.next(term);
  }

  buscarClienteEditar(term: string): void {
    console.log('term', term)
    this.flagCrear = true;
    this.busquedaCliente$.next(term);
  }

  seleccionarUsuario(Cliente: any) {
    this.flag = false;
    this.ClienteMail = Cliente.Username;
    console.log('Cliente Mail: ', Cliente);
    this.ClientName = Cliente.Nombres + ' ' + Cliente.Apellidos;
  }

  seleccionarUsuarioCrear(Cliente: any) {
    this.flagCrear = false;
    this.ClienteMailCrear = Cliente.Username;
    console.log('Cliente Mail: ', Cliente);
    this.ClientNameCrear = Cliente.Nombres + ' ' + Cliente.Apellidos;
  }

  seleccionarUsuarioEditar(Cliente: any) {
    this.flagEditar = false;
    this.ClienteMailEditar = Cliente.Username;
    console.log('Cliente Mail: ', Cliente);
    this.ClientNameEditar = Cliente.Nombres + ' ' + Cliente.Apellidos;
  }

  consultarUsuario() {
    this.rolDef = null;
    this.ClienteMailDef = this.ClienteMail;
    this._RolesService.consultarUsuario(this.rol, this.ClienteMail, this.usuario).subscribe(
      res => {
        console.log('this.rol', this.rol)
        this.flagBuscar = true;
        console.log('res consultar usuario: ', res)
        this.registros = res;
        console.log('this.registros', this.registros)

      }, err => {
        swal('Administración Roles Usuario', 'Error al consultar Roles de Usuario.', 'warning');
        console.log('Error consular roles de Usuario.');
      }
    );
  }

  consultarUsuarioActualizar() {
    console.log('this.ClienteMailDef', this.ClienteMailDef)
    console.log('this.rolDef', this.rolDef)
    this._RolesService.consultarUsuario(this.rolDef, this.ClienteMailDef, this.usuario).subscribe(
      res => {
        console.log('this.rol', this.rol)
        this.flagBuscar = true;
        console.log('res consultar usuario: ', res)
        this.registros = res;
        console.log('this.registros', this.registros)

      }, err => {
        swal('Administración Roles Usuario', 'Error al consultar Roles de Usuario.', 'warning');
        console.log('Error consular roles de Usuario.');
      }
    );
  }

  editarRol() {
    let send: any = {
      idRol: parseInt(this.ClienteRolEditar),
      emailUsuario: this.ClienteMailEditar,
      accion: 1,
      Usuario: this.usuario
    };
    console.log('Editar Rol: ', send);
    this._RolesService.editarRol(send).subscribe(
      res => {
        console.log('RES Editar Rol: ', res)
        if (res) {
          swal('Administración Roles Usuario', 'El rol al usuario fue asignado previamente.', 'warning');
        } else {
          swal('Administración Roles Usuario', 'Se edito el rol del usuario con exito.', 'success');
          this.consultarUsuarioActualizar();
        }
      }, err => {
        swal('Administración Roles Usuario', 'Error al editar rol de usuario.', 'warning');
        console.log('Error editar roles de Usuario.');
      }
    );
  }

  eliminarRol() {
    let send: any = {
      idRol: this.Cliente.IdRol,
      emailUsuario: this.Cliente.Login,
      accion: 2,
      Usuario: this.usuario
    };
    console.log('Eliminar Rol: ', send);
    this._RolesService.editarRol(send).subscribe(
      res => {
        if (res) {
          this.rolDef = null;
          this.ClienteMailDef = this.Cliente.Login;
          this.ClientName = this.Cliente.Nombre;
          swal('Administración Roles Usuario', 'Se edito el rol del usuario con exito.', 'success');
          this.consultarUsuarioActualizar();
        } else {
          swal('Administración Roles Usuario', 'Error al eliminar el rol de usuario.', 'warning');
        }

      }, err => {
        swal('Administración Roles Usuario', 'Error al eliminar el rol de usuario.', 'warning');
        console.log('Error eliminar roles de Usuario.');
      }
    );
  }

  crearRol() {
    let send: any = {
      idRol: parseInt(this.ClienteRolCrear),
      emailUsuario: this.ClienteMailCrear,
      accion: 0,
      Usuario: this.usuario
    };
    console.log('Crear Rol: ', send);
    this._RolesService.crearRol(send).subscribe(
      res => {

        console.log('RES crar rol', res)
        if (res) {
          swal('Administración Roles Usuario', 'El rol ya fue creado previamente.', 'warning');
        } else {
          swal('Administración Roles Usuario', 'Se creó el rol de usuario con exito.', 'success');
          this.consultarUsuarioActualizar();
          this.limpiarModal(null, null);
        }
      }, err => {
        swal('Administración Roles Usuario', 'Error al crear el rol de usuario.', 'warning');
        console.log('Error al crear el rol de usuario');
      }
    );
  }

  buscar(rol: HTMLInputElement, login: HTMLInputElement) {

    if (this.ClientName !== '' && this.ClientName !== undefined) {
      this.rol = rol.value;
      this.login = login.value;
      this.consultarUsuario();
    } else {
      swal('Administración Roles Usuario', 'Hay campos vacios por favor revise.', 'warning');
    }
  }

  abrirModal(modal, indexUsuario?: any, Cliente?: UsuarioRoles) {
    this.Cliente = Cliente;

    if (modal === 'editar') {
      this.ClientNameEditar = this.Cliente.Nombre;
      this.ClienteMailEditar = this.Cliente.Login;
      this.ClienteRolEditar = this.Cliente.IdRol.toString();
    }

    $('#' + modal).modal({
      keyboard: false,
      backdrop: 'static'
    });
  }

  editar(rol: HTMLInputElement, login: HTMLInputElement) {

    if (rol.value !== '0' && rol.value !== null) {
      this.editarRol();
    } else {
      swal('Administración Roles Usuario', 'Hay campos vacios por favor revise.', 'warning');
    }
  }

  crear(rol: HTMLInputElement, login: HTMLInputElement) {

    if (rol.value !== '0' && rol.value !== null && this.ClientNameCrear !== '' && this.ClientNameCrear !== undefined && this.ClientNameCrear !== null) {
      this.ClientName = this.ClientNameCrear;
      this.rolDef = null;
      this.ClienteMailDef = this.ClienteMailCrear;
      this.crearRol();
    } else {
      swal('Administración Roles Usuario', 'Hay campos vacios por favor revise.', 'warning');
    }
  }

  guardar(rol: HTMLInputElement, login: HTMLInputElement) {

    if (rol.value !== '0' && rol.value !== null && login.value !== '' && login.value !== null) {

    } else {
      swal('Administración Roles Usuario', 'Hay campos vacios por favor revise.', 'warning');
    }
  }

  limpiarModal(rol: HTMLInputElement, login: HTMLInputElement) {
    this.ClienteRolCrear = '0';
    this.ClientNameCrear = '';
    $('#crear').modal('hide');
  }

}
