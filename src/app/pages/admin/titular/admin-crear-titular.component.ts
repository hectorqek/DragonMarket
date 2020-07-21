import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ProductosService } from 'app/services/productos.service';
import { MensajeRespuesta } from 'app/model/inventario';
import { Router } from '@angular/router';
import { TitularCrear } from 'app/model/titular';
import { DominioService } from 'app/services/dominio.service';
import { Dominio } from 'app/model/dominio';
import { TitularService } from 'app/services/titular.service';
declare var $: any;

@Component({
  selector: 'app-crear-titular',
  templateUrl: './admin-crear-titular.component.html'
})
export class AdminCrearTitularComponent implements OnInit {
  @ViewChild('formularioTitular') formularioTitularCom: NgForm;


  public Opcionperecedero: boolean;
  public dominio: Dominio[] = [];
  public defaultOption: string = null;
  public noIdentificacion: string;
  public tipoIdentificacion: string = null;
  public nombres: string;
  public apellido: string;
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
    private _titularService: TitularService,
    private router: Router) {
    this.Opcionperecedero = false;
    this.isLoading = false;
    this.btnImagenCliente = false;
  }

  ngOnInit() {
    this.consultarDominioTipoDocumento();
    this.defaultOption = null;
    this.btnImagenCliente = false;
  }

  crearTitular(formularioTitular: NgForm) {
    this.isLoading = true;
    this.noIdentificacion =  formularioTitular.value.noIdentificacion;
    this.tipoIdentificacion = formularioTitular.value.tipoIdentificacion;
    this.nombres = formularioTitular.value.nombres;
    this.apellido = formularioTitular.value.apellidos;

    let crearTitular: TitularCrear;
     crearTitular = new TitularCrear(
      formularioTitular.value.tipoIdentificacion,
      formularioTitular.value.noIdentificacion,
      formularioTitular.value.nombres,
      formularioTitular.value.apellidos,
      formularioTitular.value.userName,
      formularioTitular.value.Estado
    );
    this._titularService.crearTitular(crearTitular).subscribe((data) => {
    if (data.MensajeError === "ADT0001") {
      //this.defaultOption =  this.defaultOption;
      // $("#noIdentificacion").val(this.noIdentificacion);
      // $("#tipoIdentificacion").val(this.tipoIdentificacion);
      // $("#nombres").val(this.nombres);
      // $("#apellidos").val(this.apellido);
  
      swal('Crear Titular', 'Titular ya existe','warning');
    }
    if (data.MensajeError === "ADT0000") {
      swal('Crear Titular', 'Creado exitosamente','success');
      this.cerrarModalCrearTitular();
    }
    if (data.MensajeError === "ADT9999") {
      swal('Crear Titular', 'Ha ocurrido un error','error');
    }
    this.isLoading = false;
    return
    })
  }

  consultarDominioTipoDocumento(){
    this._dominioService.consultarDominio('TipoDocumento').subscribe( (response) =>  {
      this.dominio = response;
      console.log('this.titular', this.dominio);
    }
    )
  }

  cerrarModalCrearTitular() {
    this.formularioTitularCom.resetForm();
    $('#crearTitular').modal('hide');
  }
  AbrirPopover(validacion: string) {
    $(validacion).popover('toggle');
  }
  onValueChange(value: boolean) {
    this.Opcionperecedero = value;
  }
}
