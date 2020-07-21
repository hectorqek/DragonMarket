import { NgModule } from '@angular/core';
// Importación Modulos
import { PagesModule } from '../pages/pages.module';

// Importación de los componentes
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UsuarioService } from '../services/usuario.service';
import { MainRoutingModule } from './main.routing.module';
import { LogoutComponent } from '../logout/logout.component';
import { AuthorizationComponent } from './authorization/authorization.component';

@NgModule({
    declarations: [
        HeaderComponent,
        BreadcrumbsComponent,
        SidebarComponent,
        HomeComponent,
        LogoutComponent,
        AuthorizationComponent
    ],
    exports: [
        HeaderComponent,
        BreadcrumbsComponent,
        SidebarComponent,
        HomeComponent
    ],
    imports: [
        MainRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        UsuarioService
      ],
})
export class MainModule { }
