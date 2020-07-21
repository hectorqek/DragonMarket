import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { Dominio } from 'app/model/dominio';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdmonClienteEditar } from 'app/model/cliente';
import { DominioService } from 'app/services/dominio.service';
import { ClienteService } from 'app/services/cliente.service';
import { FileHolder } from 'angular2-image-upload';
import { TitularService } from 'app/services/titular.service';
import { Titular, TitularEditar } from 'app/model/titular';
declare var $: any;

@Component({
  selector: 'app-admin-editar-cliente',
  templateUrl: './admin-editar-cliente.component.html',
  styleUrls: ['./admin-editar-cliente.component.css']
})
export class AdminEditarClienteComponent implements OnInit, OnChanges {

  @Input() public clienteEditar: AdmonClienteEditar[] = [];
  public frmCliente: FormGroup;
  public isLoading: boolean;
  public idCliente: string;
  public nombre: string;
  public apellidoCliente: string;
  public celular: string;
  public estadoCliente: boolean;
  public precioEspecialCliente: boolean;
  public dominio: Dominio[] = [];
  public tipoIdentificacion: number = null;
  public dropdownTitularesSettings = {};
  public urlImagen: string;
  public titulares: Titular[];
  public defaultOption: string = null;
  public titularesSeleccionados: TitularEditar[];
  public nuevaImagen: boolean;

  @ViewChild('editarFormularioCliente') editarFormularioCliente: NgForm;
  constructor(
    private _clienteService: ClienteService,
    private _dominioService: DominioService,
    private _titularService: TitularService
  ) {
    this.isLoading = false;
    this.nuevaImagen = true;
    this.frmCliente = new FormGroup({
      noIdentificacion: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      nombres: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      tipoCliente: new FormControl('', Validators.required),
      noCelular: new FormControl('', Validators.required),
      precioEspecial: new FormControl('', Validators.required),
      TitularesSeleccionados: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.consultarDominioTipoDocumento();
    this.consultarTitulares();
    this.defaultOption = null;
    this.dropdownTitularesSettings = {
      singleSelection: false,
      idField: 'IdClienteResponsable',
      textField: 'NombreCompleto',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Filtrar Titulares'
    };
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    if (this.clienteEditar.length > 0) {
      this.urlImagen = null;
      console.log('this.clienteEditar[0]', this.clienteEditar);
      this.nuevaImagen = true;
      this.idCliente = this.clienteEditar[0].idCliente;
      this.nombre = this.clienteEditar[0].Nombre;
      this.apellidoCliente = this.clienteEditar[0].Apellido;
      this.urlImagen = this.clienteEditar[0].Imagen;

      this.defaultOption = this.clienteEditar[0].tipoCliente == null || this.clienteEditar[0].tipoCliente == "" ? null : this.clienteEditar[0].tipoCliente;
      this.celular = this.clienteEditar[0].Celular;
      this.estadoCliente = this.clienteEditar[0].Estado;
      this.precioEspecialCliente = this.clienteEditar[0].precioEspecial;
      this.titularesSeleccionados = this.clienteEditar[0].Titulares;

    }
  }

  abrirModalEditarCliente() {
    $('#editarCliente').modal('show');
  }
  /* Métodos para subir archivos */
  onUploadFinished(file: FileHolder) {
    this.nuevaImagen = false;
    if (file.serverResponse.status === 201) {
      console.log("pasoacaImagen");
      this.urlImagen = file.file.name;
    }
  }
  onRemoved(file: FileHolder) {
    this.urlImagen = null
  }
  onUploadStateChanged(state: boolean) {
    this.nuevaImagen = false;
  }

  consultarTitulares() {
    this._titularService.consultarTitular('', null).subscribe((response) => {
      this.titulares = response;
    })
  }

  editarCliente() {
    this.isLoading = true;
    let crearCliente: AdmonClienteEditar;
    if (this.titularesSeleccionados.length <= 3) {
      if(this.titularesSeleccionados.length !== 0){
      crearCliente = new AdmonClienteEditar(
        this.frmCliente.value.noIdentificacion,
        this.frmCliente.value.nombres,
        this.frmCliente.value.apellido,
        this.defaultOption,
        this.frmCliente.value.noCelular,
        this.urlImagen,
        this.frmCliente.value.precioEspecial,
        this.frmCliente.value.estado,
        this.titularesSeleccionados
      );
      this._clienteService.editarCliente(crearCliente).subscribe((data) => {
        if (data.MensajeError === 'ADC0000') {
          this.cerrarModalEditarCliente();
        }
        this.isLoading = false;
      })
    }else{
      this.isLoading = false;
      swal('Editar Cliente', 'Debe asociar titulares al cliente.', 'warning');
    }
    } else {
      this.isLoading = false;
      swal('Editar Cliente', 'Se asociaron demasiados titulares. Máximo se puede asociar 10 titulares al cliente.', 'warning');
    }
  }

  consultarDominioTipoDocumento() {
    this._dominioService.consultarDominio('TipoCliente').subscribe((response) => {
      this.dominio = response;
      console.log('this.titular', this.dominio);
    }
    )
  }

  cerrarModalEditarCliente() {
    this.editarFormularioCliente.resetForm();
    $('#editarCliente').modal('hide');
  }

  AbrirPopover(validacion: string) {
    $(validacion).popover('toggle');
  }

}
