import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Plantilla } from '../../model/inventario';
import { Subscription } from 'rxjs/internal/Subscription';
declare var $: any;
@Component({
  selector: 'app-carga-plantilla',
  templateUrl: './carga-plantilla.component.html',
  styles: []
})
export class CargaPlantillaComponent implements OnInit {

  public isLoading: boolean;
  public ListaPlantillas: Plantilla[];
  public listaPlantillasSubcription: Subscription;
  constructor( private  _inventario: InventarioService) {
    this.isLoading = false;
   }

  ngOnInit() {
    this.cargaPlantilla();
    this.listaPlantillasSubcription = this._inventario.listaPlantillasService$.subscribe( (data) => {
      this.ListaPlantillas = data;
    })
  }
  cargaPlantilla(){
    this._inventario.cargarPlantillas().subscribe( (response) => {
      this.ListaPlantillas = response;
    });
  }
  cargarUnaPlantilla(idPlantilla: number){
    this._inventario.cargarInfoPlantilla(idPlantilla).subscribe( (response) => { 
      this.cerrarModalPlantilla();
    } );
  }
  cerrarModalPlantilla() {
    $('#cargaPlantillas').modal('hide');
  }

}
