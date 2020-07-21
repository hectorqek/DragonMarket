import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriasItemVentaService } from '../../../services/categorias-item-venta.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styles: []
})
export class CategoriasComponent implements OnInit {
  categorias = null;
  valorami = 1;
  @Output() categoriaSeleccionada: EventEmitter<number>;

  constructor( private _categoriasIVService: CategoriasItemVentaService) {
    this.categoriaSeleccionada = new EventEmitter();
  }

  ngOnInit() {
    this._categoriasIVService.getcategoriasItemVentaBackend().subscribe(
        result => {
          this.categorias = result;
        });
  }
  seleccionCategoria(idCategoriaSeleccionada) {
        this.categoriaSeleccionada.emit (idCategoriaSeleccionada);
  }
}
