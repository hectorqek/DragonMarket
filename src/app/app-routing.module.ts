import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './error-pages';
import { LoginComponent } from 'app';
import { SeleccionLoginComponent } from './login/seleccion-login.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'seleccion-login', component: SeleccionLoginComponent },
  {
    path: '',
    loadChildren: '../app/pages/pages.module#PagesModule'
  },
  {
    path: 'main',
    loadChildren: '../app/main/main.module#MainModule'
  },
  {
    path: 'pos',
    loadChildren: '../app/pos/pos.module#PosModule'
  },
  {
    path: '**', pathMatch: 'full', component: NotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
