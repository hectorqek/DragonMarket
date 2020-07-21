import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from 'app';
import { AuthorizationComponent } from './authorization/authorization.component';


const mainRoutes: Routes = [
    { path: 'logout', component: LogoutComponent },
    { path: 'authorization', component: AuthorizationComponent }
];

@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class MainRoutingModule {}