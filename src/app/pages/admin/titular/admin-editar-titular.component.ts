import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { TitularEditar, TitularCrear } from 'app/model/titular';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { TitularService } from 'app/services/titular.service';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { DominioService } from 'app/services/dominio.service';
import { Dominio } from 'app/model/dominio';
declare var $: any;

@Component({
  selector: 'app-admin-editar-titular',
  templateUrl: './admin-editar-titular.component.html',
  styleUrls: ['./admin-editar-titular.component.css']
})
export class AdminEditarTitularComponent implements OnInit, OnChanges {

  @Input() public titularEditar: TitularEditar;
  public frmTitular: FormGroup;
  public isLoading: boolean;
  public tipoIdClienteResponsable: string;
  public idClienteResponsable: string;
  public Nombres: string;
  public Apellidos: string;
  public Username: string;
  public Estado: boolean;
  public dominio: Dominio[] = [];

  @ViewChild('editarFormularioTitular') editarFormularioTitular: NgForm;
  constructor(
    private _titularService: TitularService,
    private _dominioService: DominioService
  ) {
    this.isLoading = false;
    this.frmTitular = new FormGroup({
      tipoIdentificacion: new FormControl('', Validators.required),
      NoIdentificacion: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required)
      })
  }
  ngOnInit() {
    this.consultarDominioTipoDocumento();
  }
  ngOnChanges() {
    if (this.titularEditar[0] !== undefined){
    console.log('this.titularEditar[0]',this.titularEditar[0]);
    this.frmTitular.setValue({
      tipoIdentificacion : this.titularEditar[0].TipoIdClienteResponsable,
      NoIdentificacion: this.titularEditar[0].IdClienteResponsable,
      nombre: this.titularEditar[0].Nombres,
      apellido: this.titularEditar[0].Apellidos,
      username: this.titularEditar[0].Username,
      estado: this.titularEditar[0].Estado
    })
  }
  }

  AbrirModalEditarTitular() {
    $('#editarTitular').modal('show');
  }

  consultarDominioTipoDocumento(){
    this._dominioService.consultarDominio('TipoDocumento').subscribe( (response) =>  {
      this.dominio = response;
      console.log('this.titular', this.dominio);
    }
    )
  }

  editarTitular() {
    this.isLoading = true;
    let crearTitular: TitularCrear;
    crearTitular = new TitularCrear(
      this.frmTitular.value.tipoIdentificacion,
      this.frmTitular.value.NoIdentificacion,
      this.frmTitular.value.nombre,
      this.frmTitular.value.apellido,
      this.frmTitular.value.username,
      this.frmTitular.value.estado
    );
  
    this._titularService.editarTitular(crearTitular).subscribe( (data) => {
      if (data.MensajeError === "ADT0000") {
        this.cerrarModalEditarItemVenta();
      }
    });
    this.isLoading = false;
  }
  
  cerrarModalEditarItemVenta() {
    $('#editarTitular').modal('hide');
  }
}
