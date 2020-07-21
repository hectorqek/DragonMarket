import { NgModule } from '@angular/core';
import { MainModule } from '../main/main.module';
import { PosComponent } from './pos.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ProductosComponent } from './productos/productos.component';
import { CommonModule } from '@angular/common';
import { VentaComponent } from './venta/venta.component';
import { SeleccionClienteComponent } from './cliente/seleccion-cliente/seleccion-cliente.component';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SinfotoPipe } from './pipes/sinfoto.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ItemVentaService } from '../services/ItemVenta.service';
import { PersonaBilleteraService } from '../services/PersonaBilletera';
import { KeysPipe } from './pipes/keys.pipe';
import { CategoriasItemVentaService } from '../services/categorias-item-venta.service';
import { CategoriasComponent } from './productos/categorias/categorias.component';
import { FiltroCategoriaPipe } from './pipes/filtro-categoria.pipe';
import { VentaConfirmacionComponent } from './venta/venta-confirmacion.component';
import { VentaService } from '../services/venta.service';
import { ErrorPagesModule } from '../error-pages/error-pages.module';
import { AbrirPosComponent } from './abrir-pos/abrir-pos.component';
import { PosService } from '../services/pos.service';
import { LoadingModule } from '../../../node_modules/ngx-loading';
import { CierrePosComponent } from './cierre-pos/cierre-pos.component';
import { PosRoutingModule } from './pos.routing.module';
import { ClienteService } from '../services/cliente.service';
import { UrlService } from 'app/services/sidebar.service';



@NgModule({
    declarations: [
        PosComponent,
        ClienteComponent,
        ProductosComponent,
        VentaComponent,
        SeleccionClienteComponent,
        SinfotoPipe,
        CapitalizePipe,
        KeysPipe,
        CategoriasComponent,
        FiltroCategoriaPipe,
        VentaConfirmacionComponent,
        AbrirPosComponent,
        CierrePosComponent
     ],
    exports: [

    ],
    imports: [
        PosRoutingModule,
        CommonModule,
        MainModule,
        FormsModule,
        LoadingModule
    ],
    providers: [
        ItemVentaService,
        PersonaBilleteraService,
        CategoriasItemVentaService,
        VentaService,
        PosService,
        UrlService
      ]
})
export class PosModule { }
