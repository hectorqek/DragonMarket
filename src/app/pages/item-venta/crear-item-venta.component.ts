import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriasItemVentaService } from '../../services/categorias-item-venta.service';
import { Categoria, CrearItemVenta, ItemProducto } from '../../model/ItemVenta';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/model/producto';
import { PosService } from '../../services/pos.service';
import { GestionItemVentaService } from '../../services/gestion-item-venta.service';
import { FileHolder } from 'angular2-image-upload';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';
declare var $: any;

@Component({
  selector: 'app-crear-item-venta',
  templateUrl: './crear-item-venta.component.html',
})
export class CrearItemVentaComponent implements OnInit {

  @ViewChild('formularioItemVenta') formularioItemVenta: NgForm;
  public categoriasSeleccionadas = [];
  public productosSeleccionados = [];
  public productosSeleccionadosconCantidad  = [];
  public menusSeleccionados = [];
  public dropdownCategoriasSettings = {};
  public dropdownProductosSettings = {};
  public dropdownMenusSettings = {};
  public categorias:  Categoria[];
  public productos: Producto[];
  public menus: any[];
  public urlImagen: string;
  public isLoading: boolean;


  constructor(
    private _categorias: CategoriasItemVentaService,
    private _productos: ProductosService,
    private _pos: PosService,
    private _gestionItemVenta: GestionItemVentaService) {
    this.isLoading = false;
    }
  ngOnInit() {
    this.consultarProductos();
    this.consultarCategorias();
    this.consultarMenu();
    this.urlImagen = null;
    this.categoriasSeleccionadas = [];
    this.menusSeleccionados = [];
    this.productosSeleccionados = [];
    this.productosSeleccionadosconCantidad = [];
    this.dropdownMenusSettings = {
      singleSelection: false,
      idField: 'IdMenu',
      textField: 'NombreMenu',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Filtrar Menu'
    };
    this.dropdownCategoriasSettings = {
      singleSelection: false,
      idField: 'IdCategoria',
      textField: 'NombreCategoria',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Filtrar Categorías'
    };
    this.dropdownProductosSettings = {
      singleSelection: false,
      idField: 'IdProducto',
      textField: 'NombreProducto',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Filtrar Productos'
    };
  }
  /* Métodos para subir archivos */
  onUploadFinished(file: FileHolder) {
    if (file.serverResponse.status === 201 ) {
      this.urlImagen = file.file.name;
    }
  }
  onRemoved(file: FileHolder) {
    this.urlImagen = null
  }
  onUploadStateChanged(state: boolean) {
  }

  /* Métodos para Filtros Selección */
  onItemSelect(item: Producto) {
    let objeto1: ItemProducto;
    objeto1 = new ItemProducto(item.IdProducto, item.NombreProducto, 1);
    this.productosSeleccionadosconCantidad.push(objeto1);

    
  }
  onDeSelect(item: any) {
    for (let items of this.productosSeleccionadosconCantidad) {
      let index = this.productosSeleccionadosconCantidad.indexOf(items);
      if (index > -1) {
        this.productosSeleccionadosconCantidad.splice(index, 1);
      }
    }

  }
  onSelectAll(items: any) {
    this.productosSeleccionadosconCantidad = items;
  }

  onDeSelectAll(items: any){
    this.productosSeleccionadosconCantidad = items;
  }
  consultarCategorias() {
    this._categorias.getcategoriasItemVentaBackend().subscribe ((response) => {
    this.categorias = response;
  })}
  consultarProductos() {
    this._productos.consultarProductos().subscribe( (response) => {
    this.productos = response;
  })}
  consultarMenu() {
    this._pos.consultarMenu().subscribe( (response) => {
    this.menus = response.DataArray;
  })}
  crearItemVenta(formularioItemVenta: NgForm) {
    if ( formularioItemVenta.value.PrecioVenta < 0 ) {
      let errorNoCambio: any[] = [{'CodigoError': 'IVT8001'}]
      let listadoErrores: any[] = [];
      for (let i = 0; i < errorNoCambio.length; i++) {
        let tmp: any[] = [];
        tmp.push(errorNoCambio[i].CodigoError);
        tmp.push(errorNoCambio[i].NombreProducto);
        tmp.push(errorNoCambio[i].CantidadActual);
        listadoErrores.push(tmp);
      }

      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Item de Venta');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return
    } else if ( formularioItemVenta.value.PrecioEspecial < 0 ) {
      let errorNoCambio: any[] = [{'CodigoError': 'IVT8002'}]
      let listadoErrores: any[] = [];
      for (let i = 0; i < errorNoCambio.length; i++) {
        let tmp: any[] = [];
        tmp.push(errorNoCambio[i].CodigoError);
        tmp.push(errorNoCambio[i].NombreProducto);
        tmp.push(errorNoCambio[i].CantidadActual);
        listadoErrores.push(tmp);
      }
      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Item de Venta');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return
    } else if ( formularioItemVenta.value.PrecioDescuento < 0 ) {
      let errorNoCambio: any[] = [{'CodigoError': 'IVT8003'}]
      let listadoErrores: any[] = [];
      for (let i = 0; i < errorNoCambio.length; i++) {
        let tmp: any[] = [];
        tmp.push(errorNoCambio[i].CodigoError);
        tmp.push(errorNoCambio[i].NombreProducto);
        tmp.push(errorNoCambio[i].CantidadActual);
        listadoErrores.push(tmp);
      }
      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Item de Venta');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return
    } else {
      this.isLoading = true;
      let crearItemVenta: CrearItemVenta;
      crearItemVenta = new CrearItemVenta (
        null,
        formularioItemVenta.value.Nombre,
        this.urlImagen,
        formularioItemVenta.value.PrecioVenta,
        formularioItemVenta.value.PrecioEspecial,
        formularioItemVenta.value.PrecioDescuento,
        formularioItemVenta.value.EstadoDescuento == null || formularioItemVenta.value.EstadoDescuento == "" ? false : formularioItemVenta.value.EstadoDescuento,
        formularioItemVenta.value.EstadoItemVenta == null || formularioItemVenta.value.EstadoItemVenta == "" ? false : formularioItemVenta.value.EstadoItemVenta
      )
      this._gestionItemVenta.crearItemVenta(crearItemVenta,
                                            this.productosSeleccionadosconCantidad,
                                            this.categoriasSeleccionadas,
                                            this.menusSeleccionados,
                                            0).subscribe( (data) => {
                                              this.isLoading = false;
                                            } ) ;
      this.cerrarModalCrearItemVenta();
    }
  }

  cerrarModalCrearItemVenta() {
     this.productosSeleccionadosconCantidad = [];
     this.formularioItemVenta.resetForm();
      $('#crearItemVenta').modal('hide');
  }
}
