import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ProductosService } from 'app/services/productos.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CrearProducto, Producto, ProductoBackend } from 'app/model/producto';

declare var $: any;
@Component({
  selector: 'app-editarproducto',
  templateUrl: './editarproducto.component.html'
})
export class EditarproductoComponent implements OnInit, OnChanges {
  @Input() public productoEditar: Producto;
  frmProducto: FormGroup;
  public isLoading: boolean;
  model: any = {
    onColor: 'primary',
    offColor: 'secondary',
    onText: 'Si',
    offText: 'No',
    disabled: false,
    size: '',
    value: true
  };

  constructor(private _productos: ProductosService) {
    this.frmProducto = new FormGroup ({
      idproducto: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      sku: new FormControl(''),
      descripcion: new FormControl('', Validators.required),
      perecedero: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.AbrirModalCrearProducto();
  }
  ngOnChanges() {
    this.frmProducto.setValue({
      idproducto : this.productoEditar.IdProducto,
      nombre: this.productoEditar.NombreProducto,
      sku: this.productoEditar.SKU,
      descripcion: this.productoEditar.Descripcion,
      perecedero: this.productoEditar.PerecederoB
    })
  }

  AbrirModalCrearProducto() {
    $('#editarProducto').modal('show');
  }
  cerrarModalCrearProducto() {
    $('#editarProducto').modal('hide');
  }
  actualizarProducto() {
    this.isLoading = true;
    let crearProducto: CrearProducto;
    crearProducto = new CrearProducto(
      this.frmProducto.value.idproducto,
      this.frmProducto.value.nombre,
      this.frmProducto.value.sku,
      this.frmProducto.value.descripcion,
      this.frmProducto.value.perecedero
    );
    this._productos.actualizarProducto(crearProducto).subscribe( (data) => {
      this.isLoading = false
    });
    this.cerrarModalCrearProducto();
  }
}

