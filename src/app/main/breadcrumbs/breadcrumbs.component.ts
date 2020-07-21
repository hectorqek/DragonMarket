import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { filter } from 'rxjs/operators';


import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string;

  constructor( private router: Router, private activatedRoute: ActivatedRoute, private title: Title) {
    /*this.getDataRouter().subscribe((event) => {
      this.titulo = event.titulo;
      this.title.setTitle( this.titulo);
    });*/
   }

  ngOnInit() { }

  /*getDataRouter() {
    return this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd)
    .map(() => this.activatedRoute)
    .map((route) => {
      // tslint:disable-next-line:curly
      while (route.firstChild) route = route.firstChild;
      return route;
    })
    .filter((route) => route.outlet === 'primary')
    .mergeMap((route) => route.data)
    )
  }*/
}
