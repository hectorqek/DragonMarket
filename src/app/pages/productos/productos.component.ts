import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/model/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  public editarProducto: boolean;
  public isLoading: boolean;
  public productos: Producto[] = [];

  constructor(public _productos: ProductosService) {
    this.isLoading = false;
    this.editarProducto = false;
  }
  ngOnInit() {

  }
}
