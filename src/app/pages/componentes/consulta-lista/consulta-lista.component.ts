import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ItemLista } from '../../../model/ItemVenta';

@Component({
  selector: 'app-consulta-lista',
  templateUrl: './consulta-lista.component.html',
  styleUrls: ['./consulta-lista.component.css']
})
export class ConsultaListaComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input() lista: ItemLista [] = [];
  @Output() itemSeleccionado = new EventEmitter();
  public listaSeleccionada: ItemLista[];


  public accentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u'
  }


  constructor() { }

  ngOnInit() {
    this.listaSeleccionada = this.lista;


  }
  seleccionItem(any: ItemLista){
    console.log (any);
    this.itemSeleccionado.emit(any);

  }
  accent_fold(s) {
    if (!s) { return ''; }
    let ret = '';
    for (let i = 0; i < s.length; i++) {
      ret += this.accentMap[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  };

  buscarItemVenta(termino: string) {
    let itemsArr: ItemLista[] = [];
    termino = this.accent_fold(termino.toLowerCase());
    for (let item of this.lista) {
      let nombre = this.accent_fold(item.nombre.toLowerCase());
      if (nombre.indexOf(termino) >= 0) {
        itemsArr.push(item)
      }
    }
    this.listaSeleccionada = itemsArr;
  }

}
