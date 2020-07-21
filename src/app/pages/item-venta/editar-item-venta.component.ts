import { Component, OnInit, ViewChild, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { CargaArchivosService } from '../../services/carga-archivos.service';
import { Archivos } from '../../model/Archivos';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CategoriasItemVentaService } from '../../services/categorias-item-venta.service';
import { Categoria, EditarItemVenta, CrearItemVenta, ItemProducto } from '../../model/ItemVenta';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/model/producto';
import { PosService } from '../../services/pos.service';
import { GestionItemVentaService } from '../../services/gestion-item-venta.service';
import { FileHolder } from 'angular2-image-upload';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-editar-item-venta',
  templateUrl: './editar-item-venta.component.html',

})
export class EditarItemVentaComponent implements OnInit, OnChanges {

  @Input() public itemVentaEditar: EditarItemVenta[] = [];
  public frmItemVenta: FormGroup;
  public isLoading: boolean;
  public idItemVenta: number;
  public nombreItemVenta: string;
  public estadoItemVenta: boolean;
  public precioVenta: number;
  public precioEspecial: number;
  public precioDescuento: number;
  public estadoDescuento: boolean;
  public productosSeleccionado = [];
  public categoriasSeleccionada = [];
  public productosSeleccionadosconCantidad  = [];
  public menusSeleccionado = [];
  public dropdownCategoriasSettings = {};
  public dropdownProductosSettings = {};
  public dropdownMenusSettings = {};
  public categorias: Categoria[];
  public productos: Producto[];
  public menus: any[];
  public urlImagen: string;
  public nuevaImagen: boolean;
  @ViewChild('editarFormularioItemVenta') editarFormularioItemVenta: NgForm;
  public selectedFiles: FileList;
  public archivoActual: any;
  constructor(
    private _archivo: CargaArchivosService,
    private _categorias: CategoriasItemVentaService,
    private _productos: ProductosService,
    private _pos: PosService,
    private _gestionItemVenta: GestionItemVentaService,
  ) {
    this.isLoading = false;
    this.nuevaImagen = true;
    this.frmItemVenta = new FormGroup({
      IdItemVenta: new FormControl('', Validators.required),
      Nombre: new FormControl('', Validators.required),
      EstadoItemVenta: new FormControl('', Validators.required),
      PrecioVenta: new FormControl('', Validators.required),
      PrecioEspecial: new FormControl('', Validators.required),
      PrecioDescuento: new FormControl('', Validators.required),
      EstadoDescuento: new FormControl('', Validators.required),
      ProductosSeleccionados: new FormControl('', Validators.required),
      CantidadSeleccionada: new FormControl('', Validators.required),
      CategoriasSeleccionadas: new FormControl('', Validators.required),
      MenusSeleccionados: new FormControl('', Validators.required)
    })
  }
  ngOnInit() {

    this.consultarProductos();
    this.consultarCategorias();
    this.consultarMenu();
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
  ngOnChanges() {
    if (this.itemVentaEditar.length > 0) {
      this.nuevaImagen = true;
      this.idItemVenta = this.itemVentaEditar[0].IdItemVenta;
      this.urlImagen = this.itemVentaEditar[0].ImagenItemVenta;
      this.nombreItemVenta = this.itemVentaEditar[0].NombreItemVenta;
      this.estadoItemVenta = this.itemVentaEditar[0].EstadoItemVenta;
      this.precioVenta = this.itemVentaEditar[0].PrecioVenta;
      this.precioEspecial = this.itemVentaEditar[0].PrecioEspecial;
      this.precioDescuento = this.itemVentaEditar[0].PrecioDescuento;
      this.estadoDescuento = this.itemVentaEditar[0].EstadoDescuento;
      this.productosSeleccionado = this.itemVentaEditar[0].ItemsProducto;
      this.categoriasSeleccionada = this.itemVentaEditar[0].ItemsCategoria;
      this.menusSeleccionado = this.itemVentaEditar[0].ItemsMenu;
      this.productosSeleccionadosconCantidad = this.productosSeleccionado;
    }
  }

  AbrirModalEditarItemVenta() {
    $('#editarItemVenta').modal('show');
  }

  onUploadFinished(file: FileHolder) {
    this.nuevaImagen = false;
    if (file.serverResponse.status === 201) {
      this.urlImagen = file.file.name;
    }
  }
  onRemoved(file: FileHolder) {
    this.urlImagen = null
  }
  onUploadStateChanged(state: boolean) {
    this.nuevaImagen = false;
  }
  /* Métodos para Filtros Selección */
  onItemSelect(item: any) { 
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
    this._categorias.getcategoriasItemVentaBackend().subscribe((response) => {
      this.categorias = response;
    })
  }
  consultarProductos() {
    this._productos.consultarProductos().subscribe((response) => {
      this.productos = response;
    })
  }
  consultarMenu() {
    this._pos.consultarMenu().subscribe((response) => {
      this.menus = response.DataArray;
    })
  }

  // subirImagen() {
  //   const file = this.selectedFiles.item(0);
  //   this.archivoActual = new Archivos(file);
  //   this._archivo.subirArchivo(this.archivoActual).subscribe()
  // }

  editarItemVenta() {
    if (this.frmItemVenta.value.PrecioVenta < 0) {
      let errorNoCambio: any[] = [{ 'CodigoError': 'IVT8001' }]
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
    } else if (this.frmItemVenta.value.PrecioEspecial < 0) {
      let errorNoCambio: any[] = [{ 'CodigoError': 'IVT8002' }]
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
    } else if (this.frmItemVenta.value.PrecioDescuento < 0) {
      let errorNoCambio: any[] = [{ 'CodigoError': 'IVT8003' }]
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
      let str = this.urlImagen;
      let resImagen = str.split('/');
      let crearItemVenta: CrearItemVenta;
      crearItemVenta = new CrearItemVenta(
        this.idItemVenta,
        this.frmItemVenta.value.Nombre,
        resImagen.length === 1 ? resImagen[0] : resImagen[4],
        this.frmItemVenta.value.PrecioVenta,
        this.frmItemVenta.value.PrecioEspecial,
        this.frmItemVenta.value.PrecioDescuento,
        this.frmItemVenta.value.EstadoDescuento,
        this.frmItemVenta.value.EstadoItemVenta
      )
      this._gestionItemVenta.crearItemVenta(crearItemVenta,
        this.productosSeleccionadosconCantidad,
        this.categoriasSeleccionada,
        this.menusSeleccionado,
        1).subscribe((data) => {
          this.isLoading = false;
        });
      this.cerrarModalEditarItemVenta();
    }
  }

  cerrarModalEditarItemVenta() {
    this.editarFormularioItemVenta.resetForm();
    $('#editarItemVenta').modal('hide');
  }
}
