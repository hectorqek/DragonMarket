import { Component, OnInit } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { AuthService } from 'angular-6-social-login';

import { Router } from '@angular/router';
import { globalAuthorized } from 'app/services/global';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  isAuthenticated = true;

  constructor(
    private adalSvc: AdalService,
    public OAuth: AuthService,
    public global: globalAuthorized,
    private router: Router
  ) {
    this.isAuthenticated = this.adalSvc.userInfo.authenticated;
  }

  ngOnInit() {
    if (this.isAuthenticated) {
      this.adalSvc.logOut();
    }
    this.logout();
  }
  logout() {    

    this.OAuth.signOut().then(data => {    
      console.log('data: ', data);
      this.global.authorized = false;
      this.router.navigate(['/login']);    
    }, err => {
      console.log('err: ', err);
    });    
    this.router.navigate(['/login']);    
  }    
}
