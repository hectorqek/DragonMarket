import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { Producto, ProductoBackend } from 'app/model/producto';
import { CrearProducto, ActualizarOrdenProducto } from '../model/producto';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProductosService {
  public url: string;
  public productos: Producto[] = [];
  public productosTest: Producto[];
  public producto: ProductoBackend;
  public OrdenProductos: Producto[] = [];
  public usuario: string;
  private productosSource = new BehaviorSubject<Producto[]>(this.productos);
  public  listaProductosService$ = this.productosSource.asObservable();
  private productoSource = new BehaviorSubject<ProductoBackend>(this.producto);
  public  productoService$ = this.productoSource.asObservable();
  public accentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u'
  }
  constructor(private _http: Http, private router: Router) {
    this.usuario = sessionStorage.getItem('Usuario');
    this.url = GLOBAL.url;
    this.producto = new ProductoBackend (null, '', '', false,  '', null)
  }
  consultarProductos() {
    this.productos = [];
    let params: string = 'producto?' + 'Orden=' + '0';
    return this._http.get(this.url + params).pipe(map((data) => {
      let response: ProductoBackend[] = data.json().DataArray;
      let productos: Producto[] = [];
      for (let i of response ) {
        if (i.Perecedero === true) {
          let producto: Producto;
          producto = new Producto(
            i.IdProducto,
            i.NombreProducto,
            this.accent_fold(i.NombreProducto.toLowerCase()),
            i.SKU,
            i.Perecedero === null ? false : i.Perecedero,
            'Sí',
            i.Descripcion,
            i.Orden
          )
          productos.push(producto);
        } else {
          let producto: Producto;
          producto = new Producto(
            i.IdProducto,
            i.NombreProducto,
            this.accent_fold(i.NombreProducto.toLowerCase()),
            i.SKU,
            i.Perecedero === null ? false : i.Perecedero,
            'No',
            i.Descripcion,
            i.Orden
          )
          productos.push(producto);
        }
      }
      this.productos = productos;
      this.productosSource.next(this.productos);
    return this.productos;
    }))
  }
  consultarUnProducto(idProducto: number) {
    if (idProducto !== null ){ let params: string = 'producto?' + 'IdProducto=' + idProducto;
    return this._http.get(this.url + params).pipe(map((data) => {
      let response = data.json();
      this.producto =  response.DataSingle;
      this.productoSource.next(this.producto);
      return this.producto;
    }))}

  }

  /**
   * Buscar un Producto en la lista que se recibe del Backend.
   * @param {string} termino palabra ingresado en el campo buscador.
   * @returns un arreglo con los resultados obtenidos.
   * 1. Se define una arreglo de tipo inventario vacio donde se van a almacenar los resultados.
   * 2. Se recibe el termino y se convierte a minuscula el string para envitar errores.
   * 3. Se recorre el arreglo donde estan todos los producto en este caso this.inventario.
   * 4. Se guarda en una variable los nombre de los productos.
   * 5. Con la función indexOf se busca el termino ingresado esta función devuelve 0 o 1.
   * 6. Si  lo encuentra hace un push en al productoArr.
   * 7. Retorna un arreglo con todos los productos.
   */

  accent_fold (s) {
    if (!s) { return ''; }
    let ret = '';
    for (let i = 0; i < s.length; i++) {
      ret += this.accentMap[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  };

  buscarProducto( termino: string ) {
    let productoArr: Producto[] = [];
    termino = this.accent_fold(termino.toLowerCase());
    /* termino = termino.replace('á', 'a'); */
     for (let producto of this.productos ) {
        let nombre = producto.NombrePlano;
        if ( nombre.indexOf(termino) >= 0) {
          productoArr.push( producto )
        }
    }
    return productoArr;
  }
  crearProducto(productoaCrear: CrearProducto) {
  let params: string = 'producto?' + 'Producto=' + JSON.stringify(productoaCrear) + '&' + 'Rutina=0' + '&' + 'Usuario=' + this.usuario;
  return this._http.post(this.url + params, null).pipe(map((data) => {
    let response = data.json();
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
          this.consultarProductos().subscribe();
        }
        let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Crear Producto');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
    return response;
  }))
  }
  consultarProductosOrdenar() {
    let params: string = 'producto?' + 'Orden=' + '1';
    return this._http.get(this.url + params).pipe(map((data) => {
      this.OrdenProductos = data.json().DataArray;
      return this.OrdenProductos;
    }))
  }
  actualizarProducto(producto: CrearProducto) {
      let productoEditarU: CrearProducto;
      let productoEditar: CrearProducto;
      productoEditar = new CrearProducto(
        producto.IdProducto,
        producto.NombreProducto,
        producto.SKU,
        producto.Descripcion,
        producto.Perecedero
      )

    let params: string = 'producto?' + 'Producto=' + JSON.stringify(producto) + '&' + 'Rutina=1' + '&' +  'Usuario=' + this.usuario;
    return this._http.post(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      let tmp: any[] = [];
        tmp.push(response);
        let listadoErrores: any[]  = [];
        for (let i = 0; i < tmp.length; i++) {
          let tmp2: any[] = [];
          tmp2.push(tmp[i].CodigoError);
          tmp2.push(tmp[i].IdTransaccion);
          listadoErrores.push(tmp2);
        }
        this.consultarProductos().subscribe();

      let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Actualizar Producto');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);

      return response;
    }))
  }
  actualizarOrdenProducto() {
    let listaNuevoOrden: ActualizarOrdenProducto[] = [];
    for (let i of this.OrdenProductos){
      let actualizarOrden: ActualizarOrdenProducto;
      actualizarOrden = new ActualizarOrdenProducto(
        i.IdProducto,
        i.Orden
      );
      listaNuevoOrden.push(actualizarOrden);
    }
    let params: string = 'producto?' + 'Producto=' + JSON.stringify(listaNuevoOrden) + '&' + 'Usuario=' + this.usuario;
    return this._http.put(this.url + params, null).pipe(map((data) => {
      let response = data.json();
      return response;
    }))
  }
}

