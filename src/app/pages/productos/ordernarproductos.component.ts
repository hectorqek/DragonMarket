import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/model/producto';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';

@Component({
  selector: 'app-ordernarproductos',
  templateUrl: './ordernarproductos.component.html',
  styles: [],
  providers: [ProductosService]
})
export class OrdernarproductosComponent implements OnInit {
  public productos: Producto[] = [];
  listStyle = {
    height: '500px',
    width: '100%',
    dropZoneHeight: '100px'
  }
  public isLoading: boolean;
  constructor(private _productos: ProductosService) {
    this.isLoading = false; 
   }

  ngOnInit() {
    this.consultarProductos();

  }
  consultarProductos(){
    this._productos.consultarProductosOrdenar().subscribe ( (data) => {
      this.productos = data;
    })
  }

  listSorted(list: Producto[]) {
    for (let i = 0; i < list.length; i++){
      list[i].Orden = i;
    }
  }
  actualizarOrden() {
    this.isLoading = true;
    this._productos.actualizarOrdenProducto().subscribe( response  => {
      let tmp: any[] = [];
      tmp.push(response);
      let listadoErrores: any[]  = [];
      for (let i = 0; i < tmp.length; i++) {
        let tmp2: any[] = [];
        tmp2.push(tmp[i].CodigoError);
        tmp2.push(tmp[i].IdTransaccion);
        listadoErrores.push(tmp2);
      }
      if (response.CodigoError === 'PR0000') {
        this.isLoading = false;
        this.consultarProductos();
      }
      let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Ordenar Productos');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
    },
    error => console.error('Error', error)
    );
  }

}
