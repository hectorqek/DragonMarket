import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/model/producto';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-listaaproductos',
  templateUrl: './listaaproductos.component.html',
  styles: []
})
export class ListaaproductosComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  public productos: Producto[] = [];
  public listaProductoSubcription: Subscription;
  public productoEditar: Producto;

  constructor(public _productos: ProductosService) {
    this.isLoading = false;
  }
  ngOnInit() {
    this.consultarProductos();
  }
  consultarProductos() {
    this._productos.consultarProductos().subscribe ( (data) => {
      this.productos = data;
    })
    this.listaProductoSubcription = this._productos.listaProductosService$.subscribe( (data) => {
      this.productos = data;
    })
    }
  buscarProducto( termino: string) {
    this.productos = this._productos.buscarProducto( termino );
  }
  abrirModalCrearProducto() {
    $('#crearProducto').modal({
      keyboard: false,
      backdrop: 'static',
    });
  }
  abrirModalEditarProducto(item: Producto) {
    this.productoEditar = item;
    $('#editarProducto').modal({
      keyboard: false,
      backdrop: 'static',
    })
  }
  ngOnDestroy() {
    this.listaProductoSubcription.unsubscribe();
  }
}
