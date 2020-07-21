import { Component, OnInit } from '@angular/core';    
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';    
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';    
import { Socialusers } from '../model/socialusers'; 
import { SocialloginService } from '../services/sociallogin.service';    
import { Router, ActivatedRoute, Params } from '@angular/router';    
import { globalAuthorized, GLOBAL } from 'app/services/global';
import { AdalService } from 'adal-angular4';

@Component({
  selector: 'app-seleccion-login',
  templateUrl: './seleccion-login.component.html'
})
export class SeleccionLoginComponent implements OnInit {

  response;    
  socialusers=new Socialusers();    
  public authorized : boolean = false;
  public version: String;

constructor(    
  public OAuth: AuthService,    
  private SocialloginService: SocialloginService,    
  private router: Router,
  public global: globalAuthorized,
  private adalSvc: AdalService,
) { this.version = GLOBAL.version; }    
  
ngOnInit() {    
}    
public socialSignIn(socialProvider: string) {    
  let socialPlatformProvider;    
  if (socialProvider === 'facebook') {    
    socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;    
  } else if (socialProvider === 'google') {    
    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;    
  } else if (socialProvider === 'office365') {    
    this.adalSvc.login();
  }
  
  this.OAuth.signIn(socialPlatformProvider).then(socialusers => {    
    console.log(socialProvider, socialusers);    
    console.log(socialusers);   
    console.log('this.adalSvc.userInfo.userName: ', this.adalSvc.userInfo.userName); 
    if(this.adalSvc.userInfo.userName == null || this.adalSvc.userInfo.userName == undefined || this.adalSvc.userInfo.userName == '')
    {
      this.adalSvc.userInfo.authenticated = true;
      this.adalSvc.userInfo.userName = socialusers.email;
      this.adalSvc.userInfo.token = socialusers.token;
      sessionStorage.setItem('Usuario', socialusers.email);
      this.router.navigate(['/dashboard']);    
    }
    //this.Savesresponse(socialusers);    
  
  });    
}    
Savesresponse(socialusers: Socialusers) {    
  
  this.SocialloginService.Savesresponse(socialusers).subscribe((res: any) => {    
    console.log(res);    
    this.socialusers=res;    
    this.response = res.userDetail;    
    localStorage.setItem('socialusers', JSON.stringify( this.socialusers));    
    console.log(localStorage.setItem('socialusers', JSON.stringify(this.socialusers)));    
    //this.authorized = this.global.authorized = true;
    this.router.navigate(['/dashboard']);    
  })    
}    
}    