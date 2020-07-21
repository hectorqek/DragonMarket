import { ModuleWithProviders } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import * as c from './';
import { AccesoDenegadoComponent } from './acceso-denegado.component';

const routes: Route[] = [
    { path: '404', component: c.NotFoundComponent },
    { path: '403', component: AccesoDenegadoComponent }
];

export const ErrorPagesRoutes: ModuleWithProviders = RouterModule.forChild(routes);
