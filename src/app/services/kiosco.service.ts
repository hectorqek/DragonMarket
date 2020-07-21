/* import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs';
import {Kiosco} from '../model/kiosco';

@Injectable()
export class KioscoService{
	constructor(private _http: Http){}

	getKioscos(){
		return this._http.get('https://dragonmarket-7bb30.firebaseio.com/Kioscos.json')
							.map(res => res.json());
	}

	getKiosco(id: string, random = null){
		if(random == null){
			return this._http.get('https://dragonmarket-7bb30.firebaseio.com/DragonMarket/'+id)
							.map(res => res.json());
		}else{
			return this._http.get('https://dragonmarket-7bb30.firebaseio.com/DragonMarket')
							.map(res => res.json());
		}
		
	}

	addKiosco(kiosco: Kiosco) {
		let json = JSON.stringify(kiosco);
		let params = 'json='+json;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post('https://dragonmarket-7bb30.firebaseio.com/DragonMarket', 
				params, {headers: headers}).map(res => res.json());
	}

	editKiosco(id: string, kiosco: Kiosco) {
		let json = JSON.stringify(kiosco);
		let params = 'json='+json;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post('https://dragonmarket-7bb30.firebaseio.com/DragonMarket/update-DragonMarket/'+id, 
				params, {headers: headers}).map(res => res.json());
	}

	deleteKiosco(id: string){
		return this._http.get('https://dragonmarket-7bb30.firebaseio.com/DragonMarket/delete-DragonMarket/'+id)
							.map(res => res.json());
	}
} */
