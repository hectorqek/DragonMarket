import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { FileHolder } from 'angular2-image-upload';

@Injectable({
  providedIn: 'root'
})
export class CargaArchivosService {
  public url: string;
  constructor(private _http: Http) {
    this.url = GLOBAL.url;

  }

  public subirArchivo(file: File, nombreImagen: string) {
    const formData = new FormData();
    if(file.type !== "image/jpeg"){
      swal('Crear Cliente', 'Solo se permiten tipo de imagen ".jpeg"', 'warning');
     }else{
    var file1 = new Blob([file],{type:"image/png"})
    formData.append("image", file1, nombreImagen + '.jpeg');
    
    let params: string = 'DocumentUpload?tipoImagen=foto';
    return this._http.post(this.url + params, formData).pipe(map((response) => {
      return response
    }));
    }
  }

  public cargaMasiva(file: File, userName: string, tipoArchivo: any) {
    console.log('cargaMasiva', file);
    const formData = new FormData();
    formData.append('', file, file.name);
    let params: string = 'DocumentUpload';
    return this._http.post(this.url + params + '?userName=' + userName + '&tipoArchivo=' + tipoArchivo, formData).pipe(map((data) => {
      let response: any = data.json();
      response.mensaje = JSON.parse(response.mensaje);
      console.log('respondeArchivo', response);
      return response;
    }));
  }
}
