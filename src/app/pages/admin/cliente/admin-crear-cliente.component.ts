import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Dominio } from 'app/model/dominio';
import { DominioService } from 'app/services/dominio.service';
import { ClienteService } from 'app/services/cliente.service';
import { Router } from '@angular/router';
import { AdmonClienteCrear } from 'app/model/cliente';
import { Titular, TitularEditar } from 'app/model/titular';
import { TitularService } from 'app/services/titular.service';
import { FileHolder } from 'angular2-image-upload';
import { CargaArchivosService } from 'app/services/carga-archivos.service';
import { Archivos } from 'app/model/Archivos';

declare var $: any;

@Component({
  selector: 'app-admin-crear-cliente',
  templateUrl: './admin-crear-cliente.component.html',
  styleUrls: ['./admin-crear-cliente.component.css']
})
export class AdminCrearClienteComponent implements OnInit {
  @ViewChild('formularioCliente') formularioClienteCom: NgForm;
  public selectedFiles: FileList;
  public archDelete: FileHolder;
  public archivoActual: any;
  public Opcionperecedero: boolean;
  public dominio: Dominio[] = [];
  public tipoIdentificacion: number = null;
  public defaultOption: string = null;
  public titularesSeleccionados: TitularEditar[];
  public titularesGuardar: TitularEditar[];
  public dropdownTitularesSettings = {};
  public titulares: Titular[];
  public urlImagen: string;
  public btnImagenCliente: boolean;

  model: any = {
    onColor: 'primary',
    offColor: 'secondary',
    onText: 'Si',
    offText: 'No',
    disabled: false,
    size: '',
    value: true
  };
  public isLoading: boolean;
  constructor(private _dominioService: DominioService,
    private _clienteService: ClienteService,
    private _titularService: TitularService,
    private _archivo: CargaArchivosService,
    private router: Router) {
    this.Opcionperecedero = false;
    this.isLoading = false;
  }

  ngOnInit() {
    this.consultarDominioTipoDocumento();
    this.consultarTitulares();
    this.defaultOption = null;
    this.btnImagenCliente = false;
    this.dropdownTitularesSettings = {
      singleSelection: false,
      idField: 'IdClienteResponsable',
      textField: 'NombreCompleto',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      limitSelection: 10,
      searchPlaceholderText: 'Filtrar Titulares'
    };
  }

  /* Métodos para subir archivos */
  onUploadFinished(file: File) {
    // if (file.serverResponse.status === 201) {
    //   this.urlImagen = file.file.name;
    // }
    console.log('onUploadFinished', file);
    this.subirImagen(file);
  }
  onRemoved(file: FileHolder) {
    this.urlImagen = null
  }
  onUploadStateChanged(state: boolean) {
  }

  subirImagen(file2: File) {
    //const file = this.selectedFiles.item(0);
    //this.archivoActual = new Archivos(file2);
    this._archivo.subirArchivo(file2, $('#noIdentificacion').val()).subscribe();

  }

  onKeydown(event) {
    console.log('event.keyCode', event.keyCode);
    if (event.keyCode >= 96 || event.keyCode <= 105) return true;
  };

  onKeydownIdentificacion(event) {
    this.btnImagenCliente = true;
    if (event.keyCode == 51) return false;
  };

  consultarTitulares() {
    this._titularService.consultarTitular('', null).subscribe((response) => {
      this.titulares = response;
    })
  }

  selectChildren() {
    let valores: Titular[] = [];
    let valor: Titular;
    for (let o of this.titularesSeleccionados) {
      console.log(this.titularesSeleccionados);
      for (let child of this.titulares) {
        if (child.IdClienteResponsable === o.IdClienteResponsable) {
          valor = new Titular(
            child.TipoIdClienteResponsable,
            child.IdClienteResponsable,
            child.Nombres,
            child.Apellidos,
            child.Username,
            child.Estado,
            child.DescripcionTipoIdClienteResponsable,
            child.DescripcionEstado,
            child.NombreCompleto
          )
          valores.push(valor);
        }
      }
    }
    this.titularesGuardar = valores;
  }

  crearCliente(formularioCliente: NgForm) {
    this.isLoading = true;
    this.selectChildren();
    let crearCliente: AdmonClienteCrear;
    if (this.titularesGuardar.length <= 3) {
      crearCliente = new AdmonClienteCrear(
        formularioCliente.value.noIdentificacion,
        formularioCliente.value.nombres,
        formularioCliente.value.apellidos,
        formularioCliente.value.tipoCliente,
        formularioCliente.value.celular,
        this.urlImagen,
        formularioCliente.value.precioEspecial == null
          || formularioCliente.value.precioEspecial == '' ? false : formularioCliente.value.precioEspecial,
        formularioCliente.value.estado == null || formularioCliente.value.estado == '' ? false : formularioCliente.value.estado,
        this.titularesGuardar
      );
      this._clienteService.crearCliente(crearCliente).subscribe((data) => {
        if (data.MensajeError !== 'ADT0001') {
          this.cerrarModalCrearCliente();
        }
      })
    } else {
      this.isLoading = false;
      $('#noIdentificacion').focus();
      swal('Crear Cliente', 'Se asociaron demasiados titulares. Máximo se puede asociar 10 titulares al cliente.', 'warning');
    }
  }

  consultarDominioTipoDocumento() {
    this._dominioService.consultarDominio('TipoCliente').subscribe((response) => {
      this.dominio = response;
      console.log('this.titular', this.dominio);
    }
    )
  }

  cerrarModalCrearCliente() {
    this.formularioClienteCom.resetForm();
    $('#crearCliente').modal('hide');
  }
  AbrirPopover(validacion: string) {
    $(validacion).popover('toggle');
  }
  onValueChange(value: boolean) {
    this.Opcionperecedero = value;
  }
}
