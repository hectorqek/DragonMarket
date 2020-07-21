// Importaciones para el Core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationGuard } from './common/guards/authentication-guard';
import * as c from '.';
// Importación de los Modulos

// Importación de los Componentes

// import {KioscosListComponent} from "./components/kiosco-list.component";
import { ErrorPagesModule } from './error-pages/error-pages.module';
import { AutorizacionService } from './services/Autorizacion.service';
import { LoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { AdalService} from 'adal-angular4';
import { NgxToggleModule } from 'ngx-toggle';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { SeleccionLoginComponent } from './login/seleccion-login.component';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider, AuthServiceConfig } from 'angular-6-social-login';
import { globalAuthorized } from './services/global';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


export function socialConfigs() {    
  const config = new AuthServiceConfig(    
    [    
      {    
        id: FacebookLoginProvider.PROVIDER_ID,    
        provider: new FacebookLoginProvider('1048581535514345')    
      },    
      {    
        id: GoogleLoginProvider.PROVIDER_ID,    
        provider: new GoogleLoginProvider('588051092845-h44tctuj09vn4o3vigmmelkbkemkajuq.apps.googleusercontent.com')    
      },
      {    
        id: LinkedinLoginProvider.PROVIDER_ID,    
        provider: new LinkedinLoginProvider('app-id')    
      }    
    ]    
  );    
  return config;    
}



@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,
    AppRoutingModule,
    ErrorPagesModule,
    LoadingModule,
    FormsModule,
    NgxToggleModule,
    BrowserAnimationsModule,
    HttpClientModule
   ],
  declarations: [
    c.AppComponent,
    c.LoginComponent,
    SeleccionLoginComponent
    // KioscosListComponent,
  ],
  providers: [
    AuthenticationGuard,
    AdalService,
    AuthService,
    globalAuthorized,
    {    
      provide: AuthServiceConfig,    
      useFactory: socialConfigs    
    } 
  ],
  bootstrap: [c.AppComponent]
})
export class AppModule { }
