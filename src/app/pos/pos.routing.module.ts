import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosComponent } from './pos.component';
import { SeleccionClienteComponent } from './cliente/seleccion-cliente/seleccion-cliente.component';
import { AbrirPosComponent } from './abrir-pos/abrir-pos.component';
import { AuthenticationGuard } from '../common/guards/authentication-guard';
import { HistorialVentasComponent } from 'app/pages/historial-ventas/historial-ventas.component';
import { CierrePosComponent } from './cierre-pos/cierre-pos.component';

const mainRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthenticationGuard],
        canActivateChild: [AuthenticationGuard],
        children: [
            { path: 'abrir', component: AbrirPosComponent, data: { titulo: 'Abrir Pos' } },
            { path: 'seleccionar-cliente', component: SeleccionClienteComponent, data: { titulo: 'Selección de Cliente' } },
            { path: 'cierre-periodo-trabajo', component: CierrePosComponent},
            { path: 'venta', component: PosComponent, data: { titulo: 'Venta' }},
            { path: '', redirectTo: 'abrir', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class PosRoutingModule {}

