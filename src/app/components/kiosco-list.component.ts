// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute, Params } from '@angular/router';

// import {KioscoService} from '../services/kiosco.service';
// import {Kiosco} from '../model/kiosco';

// @Component({
// 	selector: 'kioscos-list',
// 	templateUrl: '../kiosco/kiosco-list.html',
// 	providers: [KioscoService]
// })

// export class KioscosListComponent implements OnInit {
// 	public titulo: string = 'Listado de kioscos:';
// 	public kioscos: Kiosco[];
// 	public status: string;
// 	public errorMessage;
// 	public confirmado;
// 	people: any[] = [];

// 	constructor(
// 		private _route: ActivatedRoute,
// 		private _router: Router,
// 		private _kioscoService: KioscoService
// 	){}

//  	ngOnInit() {
		 
//  		this.getKioscos();
// 		console.log('kioscos-list component cargado');
// 	}

// 	getKioscos(){
// 		let box_kioscos = <HTMLElement>document.querySelector('#kioscos-list .loading');
// 		box_kioscos.style.visibility = 'visible';

// 		this._kioscoService.getKioscos()
// 									.subscribe(
// 										result => {
// 												console.log('data',result);
// 												this.kioscos = result.data;
// 												this.status = result.status;
// 												console.log('kiosco',this.kioscos);
// 												if(this.status !== 'success'){
// 													console.log('error',this.status);
// 													alert('Error en el servidor!!');
// 												}

// 												box_kioscos.style.display = 'none';
// 										},
// 										error => {
// 											this.errorMessage = <any>error;
											
// 											if(this.errorMessage !== null){
// 												console.log(this.errorMessage);
// 												alert('Error en la petición');
// 											}
// 										}
// 									);
// 	}

// 	onBorrarConfirm(id){
// 		this.confirmado = id;
// 	}

// 	onCancelarConfirm(id){
// 		this.confirmado = null;
// 	}

// 	onBorrarKiosco(id){
// 			this._kioscoService.deleteKiosco(id)
// 						.subscribe(
// 							result => {
// 									this.status = result.status;

// 									if(this.status !== 'success'){
// 										alert('Error en el servidor');
// 									}
// 									this.getKioscos();

// 							},
// 							error => {
// 								this.errorMessage = <any>error;
								
// 								if(this.errorMessage !== null){
// 									console.log(this.errorMessage);
// 									alert('Error en la petición');
// 								}
// 							}
// 						);
// 	}

// }