import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { EstadoCliente } from 'app/model/comun';
import { TitularService } from 'app/services/titular.service';
import { Titular, TitularEditar } from 'app/model/titular';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-admin-lista-titular',
  templateUrl: './admin-lista-titular.component.html',
  styleUrls: ['./admin-lista-titular.component.css']
})
export class AdminListaTitularComponent implements OnInit, OnChanges {

  nrSelect: number = 1;
  public isLoading: boolean = false;
  public btnConsultar: boolean;
  public estadoCliente: EstadoCliente[] = [];
  public titularEditar: TitularEditar[] = [];
  public titular: Titular[] = [];
  public tipoIdentificacion: number = -1;
  public defaultOption: number = -1;
  public tblListaTitular: boolean = true;
  public listaTitularSubcription: Subscription;

  constructor(private _titularService: TitularService) {
    this.estadoCliente = [
      {
        Id: 1,
        Estado: 'Activo'
       },
       {
        Id: 0,
        Estado: 'Inactivo'
       }
       ,
       {
        Id: null,
        Estado: 'Todos'
       }
    ]
  }

  ngOnInit() {
    this.btnConsultar = true;
    $('#inpText').focus();
    console.log("ngOnInit");
  }

  ngOnChanges() {
    console.log("ngOnChanges");
  };


  onKeydown(event) {
    //console.log('event.keyCode',event.keyCode);
    if (event.keyCode == 51) return false;
    if (event.keyCode == 259) return false;
    if (event.keyCode == 226) return false;
    if (event.keyCode == 220) return false;
    if (event.keyCode == 18) return false;
    if (event.keyCode == 53) return false;
    if (event.keyCode == 219) return false;
  };

  onSearchChange(searchValue: string): void {
    if(searchValue.length >= 3){
      this.btnConsultar = false;
    }else{
      this.btnConsultar = true;
    }
    console.log(searchValue.length);
  }

  // tslint:disable-next-line: one-line
  consultarTitular(busqueda: string){
    this.isLoading = true;
    this.nrSelect =  '' ? null : this.nrSelect;
    localStorage.setItem("busqTitular",busqueda);
    localStorage.setItem("estTitular",this.nrSelect.toString());
    this._titularService.consultarTitular(busqueda, this.nrSelect).subscribe( (response) =>  {
    this.titular = response;
    this.listaTitularSubcription = this._titularService.ListaTitularService$.subscribe( (response) => {
    console.log('editar','sdsddsdsds');
      if (response !== undefined) {
      this.titular = response;
      }
    })
      if(this.titular.length === 0) {
        swal('Consulta de Titulares', 'No se encontraron titulares, para los criterios de búsqueda especificados', 'warning');
        this.tblListaTitular = true;
      }else{
        this.tblListaTitular = false;
      }
      this.isLoading = false;
    })
  }

  abrirModalCrearTitular() {
    this.tipoIdentificacion = -1;
    $('#crearTitular').modal({
      keyboard: false,
      backdrop: 'static'
      });
   }

   abrirModalEditarTitular(tipoIdentificacionCliente: string, numeroIdentificacionCliente: string) {
    this._titularService.consultarTitularParaEditar(tipoIdentificacionCliente, numeroIdentificacionCliente).subscribe( (response) => {
      Promise.resolve(null).then(() =>  this.titularEditar = response);
      $('#editarTitular').modal({
        keyboard: false,
        backdrop: 'static',
      })
    })

  }

}
