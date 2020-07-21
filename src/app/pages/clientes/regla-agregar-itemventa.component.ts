import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriasItemVentaService } from '../../services/categorias-item-venta.service';
import { ReglaItemVenta, ReglaConsumoTransaccion, ReglaConsumoGuardar, ReglaConsumoVer } from '../../model/cliente';
import { ProductosService } from 'app/services/productos.service';
import { GestionItemVenta } from 'app/model/ItemVenta';
import { ReglasNotificacionesService } from '../../services/reglas-notificaciones.service';
import { GestionItemVentaService } from '../../services/gestion-item-venta.service';
import { FileHolder } from 'angular2-image-upload';
import { MensajeRespuesta } from 'app/model/inventario';
import { ManejadorErroresPageModule } from '../lista-errores';
declare var $: any;

@Component({
    selector: 'app-regla-agregar-item-venta',
    templateUrl: './regla-agregar-itemventa.component.html',
})
export class ReglaAgregarItemVentaComponent implements OnInit {

    @ViewChild('formularioItemVenta') formularioItemVenta: NgForm;
    public productosSeleccionados = [];
    public productosSeleccionadosconCantidad = [];
    public dropdownProductosSettings = {};
    public itemsVenta: GestionItemVenta[];
    public isLoading: boolean;
    public idCliente: string;
    public idBolsillo: number;
    public nombreCliente: string;
    public apellidoCliente: string;
    public nombreBolsillo: string;
    public botonGuardar: boolean;
    @Input() public reglaConsumo: ReglaConsumoGuardar[] = [];

    constructor(
        private _reglas: ReglasNotificacionesService,
        private _gestionItemVenta: GestionItemVentaService) {
        this.isLoading = false;
        this.botonGuardar = false;
    }
    ngOnInit() {
        this.consultarProductos();
        this.productosSeleccionados = [];
        this.productosSeleccionadosconCantidad = [];

        this.dropdownProductosSettings = {
            singleSelection: false,
            idField: 'IdItemVenta',
            textField: 'Nombre',
            selectAllText: 'Seleccionar Todos',
            unSelectAllText: 'Deseleccionar Todos',
            itemsShowLimit: 10,
            allowSearchFilter: true,
            searchPlaceholderText: 'Filtrar Productos'
        };
    }
    ngOnChanges() {
        if (this.reglaConsumo.length > 0) {
            this.idCliente = this.reglaConsumo[0].IdCliente;
            this.idBolsillo = this.reglaConsumo[0].IdBolsillo;
            this.nombreCliente = this.reglaConsumo[0].NombreCliente;
            this.apellidoCliente = this.reglaConsumo[0].ApellidoCliente;
            this.nombreBolsillo = this.reglaConsumo[0].NombreBolsillo;
        }
    }

    /* Métodos para Filtros Selección */
    onItemSelect(item: GestionItemVenta) {
        let objeto1: ReglaConsumoVer;
        objeto1 = new ReglaConsumoVer(this.idCliente, this.idBolsillo, 3, 1, true, item.IdItemVenta, 0, item.Nombre);
        this.productosSeleccionadosconCantidad.push(objeto1);

        if(this.productosSeleccionadosconCantidad.length > 0){
            this.botonGuardar = true;
        }else{
            this.botonGuardar = false;
        }
    }
    onDeSelect(item: any) {
        for (let items of this.productosSeleccionadosconCantidad) {
            let index = this.productosSeleccionadosconCantidad.indexOf(items);
            if (index > -1) {
                this.productosSeleccionadosconCantidad.splice(index, 1);
            }
        }

        if(this.productosSeleccionadosconCantidad.length > 0){
            this.botonGuardar = true;
        }else{
            this.botonGuardar = false;
        }

    }
    onSelectAll(items: any) {
        this.productosSeleccionadosconCantidad = items;
        if(this.productosSeleccionadosconCantidad.length > 0){
            this.botonGuardar = true;
        }else{
            this.botonGuardar = false;
        }
    }

    onDeSelectAll(items: any) {
        this.productosSeleccionadosconCantidad = items;
        if(this.productosSeleccionadosconCantidad.length > 0){
            this.botonGuardar = true;
        }else{
            this.botonGuardar = false;
        }
    }

    consultarProductos() {
        this._gestionItemVenta.consultarItemVenta().subscribe((response) => {
            this.itemsVenta = response;
        })
    }

    agregarReglaItemVenta(formularioItemVenta: NgForm) {
        this.isLoading = true;
        let crearItemVenta: ReglaConsumoTransaccion;
        let respuesta: any[] = [];
        this._reglas.actualizarReglaLimitacionConsumo(this.productosSeleccionadosconCantidad).subscribe((response) => {
            let tmp: any[] = [];
            tmp.push(response);
            let tmp2: any[] = [];
            for (let i = 0; i < tmp.length; i++) {
                tmp2.push(tmp[i].CodigoError);
                tmp2.push(tmp[i].IdTransaccion);
            }
            respuesta.push(tmp2);
            console.log('resp', respuesta);
            this.notificacion(respuesta);
            if (response.CodigoError === 'RG0000') {
                this.isLoading = false;
                this.cerrarModalReglaAgregarItemVenta();
            }
        },
            error => console.error('Error al eliminar la regla', error));
    }

    cerrarModalReglaAgregarItemVenta() {
        this.productosSeleccionadosconCantidad = [];
        this.formularioItemVenta.resetForm();
        $('#reglaAgregarItemVenta').modal('hide');
    }

    notificacion(respuesta: any[]) {
        this.isLoading = false;
        let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(respuesta, 'Regla de consumo');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      }
}
