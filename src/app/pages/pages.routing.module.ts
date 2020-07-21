import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationGuard } from '../common/guards/authentication-guard';
import { InventarioComponent } from './inventario/inventario.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RecargaComponent } from './clientes/recarga.component';
import { ConfirmacionVentaComponent } from './clientes/confirmacion-venta.component';
import { SeleccionPosComponent } from './configuracion/seleccion-pos/seleccion-pos.component';
import { HistorialTransaccionesComponent } from './clientes/historial-transacciones.component';
import { HistorialVentasComponent } from './historial-ventas/historial-ventas.component';
import { RedistribucionSaldosComponent } from './clientes/redistribucion-saldos.component';
import { HistorialRecargasComponent } from './clientes/historial-recargas.component';
import { ConsultarClienteComponent } from './clientes/consultar-cliente.component';
import { RedistribucionSaldosXClienteComponent } from './clientes/redistribucion-saldos-x-cliente.component';
import { DevolucionSaldoComponent } from './clientes/devolucion-saldo.component';
import { ConfirmacionReversionComponent } from './clientes/confirmacion-reversion.component';
import { ReglasComponent } from './clientes/reglas.component';
import { ConfirmacionDevolucionComponent } from './clientes/confirmacion-devolucion.component';
import { ProductosComponent } from './productos/productos.component';
import { OrdernarproductosComponent } from './productos/ordernarproductos.component';
import { ItemVentaComponent } from './item-venta/item-venta.component';
import { CrearItemVentaComponent } from './item-venta/crear-item-venta.component';
import { TransferenciaComponent } from './inventario/transferencia.component';
import { ReglaConsumoComponent } from './clientes/regla-consumo.component';
import { CierrePosComponent } from '../pos/cierre-pos/cierre-pos.component';
import { AdminTitularComponent } from './admin/titular/admin-titular.component';
import { AdminClienteComponent } from './admin/cliente/admin-cliente.component';
import { CargaMasivaComponent } from './admin/carga-masiva/carga-masiva.component';
import { RecargaCargaMasivaComponent } from './admin/recarga-carga-masiva/recarga-carga-masiva.component';
import { ConsultaRecargasComponent } from './admin/consulta-recargas/consulta-recargas.component';
import { RolesComponent } from './configuracion/roles/roles.component';
import { TableroComponent } from './dashboard/tablero.component';


const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        canActivate: [AuthenticationGuard],
        canActivateChild: [AuthenticationGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'tablero', component: TableroComponent, data: { titulo: 'Tablero' } },
            // tslint:disable-next-line:max-line-length
            /*Cliente */
            {
                path: 'cliente', data: { titulo: 'Recargas Cliente' }, children:
                    [
                        { path: 'recargas', component: RecargaComponent },
                        // tslint:disable-next-line:max-line-length
                        { path: 'confirmacion-recarga/:IdTransaccion', component: ConfirmacionVentaComponent, data: { titulo: 'Confirmacion Recarga Cliente' } },
                        { path: 'historial-transacciones', component: HistorialTransaccionesComponent },
                        { path: 'redistribucion-saldos', component: RedistribucionSaldosComponent },
                        { path: 'reglas', component: ReglasComponent },
                        { path: 'regla-consumo', component: ReglaConsumoComponent },
                        { path: 'admin-titular', component: AdminTitularComponent },
                        { path: 'admin-cliente', component: AdminClienteComponent },
                        { path: 'carga-masiva-cliente', component: CargaMasivaComponent },
                        { path: 'consulta-transacciones', component: ConsultaRecargasComponent },
                        { path: 'recarga-carga-masiva-cliente', component: RecargaCargaMasivaComponent }
                    ]
            },
            /* Principal */
            {
                path: 'principal', children:
                    [
                        { path: 'consultar-clientes', component: ClientesComponent, data: { titulo: 'Clientes' } },
                        { path: 'reversion-recargas', component: HistorialRecargasComponent, data: { titulo: 'Reversión Recargas' } },
                        { path: 'redistribucion-saldos', component: RedistribucionSaldosXClienteComponent, data: { titulo: 'Clientes' } },
                        { path: 'devolucion-saldo', component: DevolucionSaldoComponent, data: { titulo: 'Clientes' } },
                        { path: 'confirmacion-devolucion/:IdAjuste', component: ConfirmacionDevolucionComponent, data: { titulo: 'Clientes' } },
                        // tslint:disable-next-line:max-line-length
                        { path: 'confirmacion-reversion/:IdTransaccion', component: ConfirmacionReversionComponent, data: { titulo: 'Confirmacion Reversión Cliente' } }
                    ]
            },
            /* Administracion*/
            {
                path: 'configuracion', data: { titulo: 'Administracion' }, children:
                    [
                        { path: 'seleccion-pos', component: SeleccionPosComponent },
                        { path: 'asignacion-roles', component: RolesComponent }
                    ]
            },
            /* Productos  */
            {
                path: 'productos', data: { titulo: 'Productos' }, children:
                    [
                        { path: 'gestion', component: ProductosComponent },
                        { path: 'ordenar-productos', component: OrdernarproductosComponent },
                        { path: 'item-venta', component: ItemVentaComponent }
                    ],
            },
            /* Inventario */
            {
                path: 'inventario', data: { titulo: 'Recargas Cliente' }, children:
                    [
                        { path: 'transferencias', component: TransferenciaComponent, data: { titulo: 'Transferencias' } },
                        { path: 'carga-bodega-central', component: InventarioComponent, data: { titulo: 'Carga Bodega Central' } },
                    ]
            },
            {
                path: 'gestion-pos', data: { titulo: 'POS' }, children:
                    [
                        { path: 'historial-ventas', component: HistorialVentasComponent, data: { titulo: 'Transferencias' } }
                    ]
            },
            /**POS  */
            /* { path: 'consultar-cliente-pos', component: ConsultarClienteComponent },*/
            /* { path: 'crear-item-venta', component: CrearItemVentaComponent},*/
            /**/
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }