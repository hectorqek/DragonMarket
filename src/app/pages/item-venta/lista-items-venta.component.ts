import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GestionItemVenta, ItemVenta, EditarItemVenta } from 'app/model/ItemVenta';
import { GestionItemVentaService } from 'app/services/gestion-item-venta.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-lista-items-venta',
  templateUrl: './lista-items-venta.component.html',
  
})
export class ListaItemsVentaComponent implements OnInit {
  model: any = {
    onColor: 'primary',
    offColor: 'secondary',
    onText: 'Si',
    offText: 'No',
    disabled: false,
    size: '',
    value: null
  };
  public prueba: boolean; 

  /* Atributos */
  public isLoading: boolean;
  public itemsVenta: GestionItemVenta[] = [];
  public listaItemVentaSubcription: Subscription;
  public itemVentaEditar: EditarItemVenta[] = [];

  constructor(private _gestionItemVenta: GestionItemVentaService) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.consultarItemVenta();
  }

  consultarItemVenta() {
    this.isLoading = true;
    this._gestionItemVenta.consultarItemVenta().subscribe( (response) =>  {
        this.itemsVenta = response;
        this.isLoading = false;
      }
    )
    /*this.listaItemVentaSubcription = this._gestionItemVenta.ListaItemService$.subscribe( (data) => {
      this.itemsVenta = data;
    })*/
  }
  buscarItemVenta( termino: string) {
    this.itemsVenta = this._gestionItemVenta.buscarItemVenta (termino);
  }
  abrirModalCrearProducto() {
    $('#crearItemVenta').modal({
      keyboard: false,
      backdrop: 'static'
    });
  }
  abrirModalEditarItemVenta(item: GestionItemVenta) {
    this._gestionItemVenta.consultarItemVentaEditar(item.IdItemVenta).subscribe( (response) => {
      console.log('responseabrirModalEditarItemVenta',response);
      Promise.resolve(null).then(() =>  this.itemVentaEditar = response);
      $('#editarItemVenta').modal({
        keyboard: false,
        backdrop: 'static',
      })
    })

  }
  editarProducto(item: ItemVenta) {
    this._gestionItemVenta.editarUnProducton(item).subscribe( (response) => {
    })
  }
}
