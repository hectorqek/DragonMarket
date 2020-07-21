import { Component, OnInit } from '@angular/core';
import { Plantilla } from 'app/model/inventario';
import { InventarioService } from 'app/services/inventario.service';
import { NgForm } from '@angular/forms';
import { CrearPlantilla } from '../../model/inventario';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-guardar-plantilla',
  templateUrl: './guardar-plantilla.component.html',
  styles: []
})
export class GuardarPlantillaComponent implements OnInit {

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
  cargaPlantilla() {
    this._inventario.cargarPlantillas().subscribe( (response) => {
      this.ListaPlantillas = response;
    });
  }
  cargarUnaPlantilla(idPlantilla: number){
    this._inventario.cargarInfoPlantilla(idPlantilla).subscribe( (response) =>{
    } );
  }
  cerrarModalPlantilla() {
    $('#guardarPlantilla').modal('hide');
  }
  crearPlantilla(formularioProducto: NgForm) {
    this.isLoading = true;
    let crearPlantilla: CrearPlantilla;
    crearPlantilla = new CrearPlantilla(
      null,
      formularioProducto.value.NombrePlantilla,
    );
    this._inventario.gestionPlantilla(crearPlantilla, 0).subscribe( data => {
    this.isLoading = false});
    this.cerrarModalPlantilla();
  }
  sobreescribirPlantilla(id:number, nombre:string)  {
    this.isLoading = true;
    let actualizarPlantilla: CrearPlantilla;
    actualizarPlantilla = new CrearPlantilla(
      id,
      nombre,
    );
    this._inventario.gestionPlantilla(actualizarPlantilla, 1).subscribe( data => {
    this.isLoading = false});
    this.cerrarModalPlantilla();
  }
}
