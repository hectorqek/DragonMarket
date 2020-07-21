import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  message : String;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.message = this.route.snapshot.queryParams['message'];
  }
}
