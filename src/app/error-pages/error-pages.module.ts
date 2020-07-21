import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPagesRoutes } from './error-pages.routing';
import { NotFoundComponent } from './';
import { AccesoDenegadoComponent } from './acceso-denegado.component';


@NgModule({
  imports: [
    CommonModule,
    ErrorPagesRoutes
  ],
  declarations: [NotFoundComponent, AccesoDenegadoComponent]
})
export class ErrorPagesModule { }
