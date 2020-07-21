import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainModule } from '../main/main.module';
import { UrlService } from '../services/sidebar.service';
import { InventarioComponent } from './inventario/inventario.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { FiltroKioskoPipe } from './pipes/filtro-kiosko.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from '../services/cliente.service';
import { RecargaComponent } from './clientes/recarga.component';
import { ConfirmacionVentaComponent } from './clientes/confirmacion-venta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LoaderComponent } from 'app/utils/Loader.component';
import { SeleccionPosComponent } from './configuracion/seleccion-pos/seleccion-pos.component';
import { HistorialTransaccionesComponent } from './clientes/historial-transacciones.component';
import { HistorialVentasComponent } from './historial-ventas/historial-ventas.component';
import { HistorialVentasUsuarioComponent } from './historial-ventas/historial-ventas-usuario.component';
import { RedistribucionSaldosComponent } from './clientes/redistribucion-saldos.component';
import { HistorialRecargasComponent } from './clientes/historial-recargas.component';
import { ConsultarClienteComponent } from './clientes/consultar-cliente.component';
import { SinfotoPipe } from './pipes/sinfoto.pipe';
import { RedistribucionSaldosXClienteComponent } from './clientes/redistribucion-saldos-x-cliente.component';
import { DevolucionSaldoComponent } from './clientes/devolucion-saldo.component';
import { ConfirmacionReversionComponent } from './clientes/confirmacion-reversion.component';
import { ReglasComponent } from './clientes/reglas.component';
import { ConfirmacionDevolucionComponent } from './clientes/confirmacion-devolucion.component';
import { ProductosComponent } from './productos/productos.component';
import { CrearproductoComponent } from './productos/crearproducto.component';
import { NgxSortableModule } from 'ngx-sortable';
import { OrdernarproductosComponent } from './productos/ordernarproductos.component'
import { UiSwitchModule } from 'ngx-ui-switch';
import { ItemVentaComponent } from './item-venta/item-venta.component';
import { CrearItemVentaComponent } from './item-venta/crear-item-venta.component';
import { EditarproductoComponent } from './productos/editarproducto.component';
import { ProductosService } from 'app/services/productos.service';
import { ListaaproductosComponent } from './productos/listaaproductos.component';
import { ListaItemsVentaComponent } from './item-venta/lista-items-venta.component';
import { CategoriasItemVentaService } from '../services/categorias-item-venta.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditarItemVentaComponent } from './item-venta/editar-item-venta.component';
import { NgxToggleModule } from 'ngx-toggle';
import { ImageUploadModule } from 'angular2-image-upload';
import { TransferenciaComponent } from './inventario/transferencia.component';
import { CargaPlantillaComponent } from './inventario/carga-plantilla.component';
import { GuardarPlantillaComponent } from './inventario/guardar-plantilla.component';
import { PagesRoutingModule } from './pages.routing.module';
import { PosService } from '../services/pos.service';
import { ConsultaListaComponent } from './componentes/consulta-lista/consulta-lista.component';
import { ReglaConsumoComponent } from './clientes/regla-consumo.component';
import { ReglaAgregarItemVentaComponent } from './clientes/regla-agregar-itemventa.component';
import { AdminTitularComponent } from './admin/titular/admin-titular.component';
import { AdminCrearTitularComponent } from './admin/titular/admin-crear-titular.component';
import { AdminListaTitularComponent } from './admin/titular/admin-lista-titular.component';
import { AdminEditarTitularComponent } from './admin/titular/admin-editar-titular.component';
import { AdminClienteComponent } from './admin/cliente/admin-cliente.component';
import { AdminEditarClienteComponent } from './admin/cliente/admin-editar-cliente.component';
import { AdminCrearClienteComponent } from './admin/cliente/admin-crear-cliente.component';
import { AdminListaClienteComponent } from './admin/cliente/admin-lista-cliente.component';
import { CargaMasivaComponent } from './admin/carga-masiva/carga-masiva.component';
import { RecargaCargaMasivaComponent } from './admin/recarga-carga-masiva/recarga-carga-masiva.component';
import { ConsultaRecargasComponent } from './admin/consulta-recargas/consulta-recargas.component';
import { RolesComponent } from './configuracion/roles/roles.component';
import { TableroComponent } from './dashboard/tablero.component';
import { DashboardService } from 'app/services/dashboard.service';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        //nuevo
        TableroComponent,
        InventarioComponent,
        FiltroKioskoPipe,
        CapitalizePipe,
        ClientesComponent,
        RecargaComponent,
        ConfirmacionVentaComponent,
        LoaderComponent,
        SeleccionPosComponent,
        HistorialTransaccionesComponent,
        HistorialVentasComponent,
        HistorialVentasUsuarioComponent,
        RedistribucionSaldosComponent,
        HistorialRecargasComponent,
        ConsultarClienteComponent,
        SinfotoPipe,
        RedistribucionSaldosXClienteComponent,
        DevolucionSaldoComponent,
        ConfirmacionReversionComponent,
        ReglasComponent,
        ConfirmacionDevolucionComponent,
        ProductosComponent,
        CrearproductoComponent,
        OrdernarproductosComponent,
        ItemVentaComponent,
        CrearItemVentaComponent,
        EditarproductoComponent,
        ListaaproductosComponent,
        ListaItemsVentaComponent,
        EditarItemVentaComponent,
        TransferenciaComponent,
        CargaPlantillaComponent,
        GuardarPlantillaComponent,
        ConsultaListaComponent,
        ReglaConsumoComponent,
        ReglaAgregarItemVentaComponent,
        AdminTitularComponent,
        AdminCrearTitularComponent,
        AdminListaTitularComponent,
        AdminEditarTitularComponent,
        AdminClienteComponent,
        AdminEditarClienteComponent,
        AdminCrearClienteComponent,
        AdminListaClienteComponent,
        CargaMasivaComponent,
        RecargaCargaMasivaComponent,
        ConsultaRecargasComponent,
        RolesComponent
    ],
    exports: [
        DashboardComponent,
        InventarioComponent,
        LoaderComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        MainModule,
        ReactiveFormsModule,
        TextMaskModule,
        JsonpModule,
        FormsModule,
        UiSwitchModule,
        NgxSortableModule,
        NgMultiSelectDropDownModule.forRoot(),
        ImageUploadModule.forRoot(),
        NgxToggleModule
    ],
    providers: [
        ClienteService,
        UrlService,
        ProductosService,
        CategoriasItemVentaService,
        PosService,
        //nuevo
        DashboardService
      ],

})
export class PagesModule { }
