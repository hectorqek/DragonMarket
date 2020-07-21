import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgForm} from '@angular/forms';
import { CrearProducto, Producto } from '../../model/producto';
import { ProductosService } from 'app/services/productos.service';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';
import { Router } from '@angular/router';
import { ProductosComponent } from './productos.component';
declare var $: any;
@Component({
  selector: 'app-crearproducto',
  templateUrl: './crearproducto.component.html'
})
export class CrearproductoComponent implements OnInit {
  @ViewChild('formularioProducto') formularioProductoCom: NgForm;
  public Opcionperecedero: boolean;
  public productos: Producto[] = [];
  public btnConsultar: boolean = false;
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
  constructor(private _productos: ProductosService, private router: Router) {
    this.Opcionperecedero = false;
    this.isLoading = false;
  }

  ngOnInit() {
    this.btnConsultar = true;
  }

  crearProducto(formularioProducto: NgForm) {
    this.isLoading = true;
    let crearProducto: CrearProducto;
    crearProducto = new CrearProducto(
      null,
      formularioProducto.value.Nombre,
      formularioProducto.value.sku,
      formularioProducto.value.descripcion,
      this.Opcionperecedero
    );
    this._productos.crearProducto(crearProducto).subscribe( data => this.isLoading = false);
    this.cerrarModalCrearProducto();
  }

  cerrarModalCrearProducto() {
    this.Opcionperecedero = false;
    this.formularioProductoCom.resetForm();
    $('#crearProducto').modal('hide');
  }
  AbrirPopover(validacion: string) {
    $(validacion).popover('toggle');
  }
  onValueChange(value: boolean) {
    this.Opcionperecedero = value;
  }
}
