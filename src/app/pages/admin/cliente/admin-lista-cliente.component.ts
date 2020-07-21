import { Component, OnInit } from '@angular/core';
import { EstadoCliente } from 'app/model/comun';
import { ClienteService } from 'app/services/cliente.service';
import { AdmonClienteConsulta, AdmonClienteEditar } from 'app/model/cliente';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-admin-lista-cliente',
  templateUrl: './admin-lista-cliente.component.html',
  styleUrls: ['./admin-lista-cliente.component.css'],
  providers: [ClienteService]
})
export class AdminListaClienteComponent implements OnInit {

  nrSelect: number = 1;
  public isLoading: boolean;
  public btnConsultar: boolean;
  public estadoCliente: EstadoCliente[] = [];
  public clienteEditar: AdmonClienteEditar[] = [];
  public cliente: AdmonClienteConsulta[] = [];
  public tipoIdentificacion: number = -1;
  public tblListaCliente: boolean = true;
  public listaClienteSubcription: Subscription;

  constructor(private _clienteService: ClienteService) {
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
    this.tblListaCliente = true;
    $('#inpText').focus();
    //this.consultarCliente("car");
  }

  // tslint:disable-next-line: one-line
  consultarCliente(busqueda: string){
    this.isLoading = true;
    this.nrSelect =  '' ? null : this.nrSelect;
    localStorage.setItem("busqCliente",busqueda);
    localStorage.setItem("estCliente",this.nrSelect.toString());
    this._clienteService.consultarAdmonCliente(busqueda, this.nrSelect).subscribe( (response) =>  {
    this.isLoading = false;
    this.cliente = response;
    console.log('sdsdsd',response);
    this.listaClienteSubcription = this._clienteService.ListaItemService$.subscribe( (response1) => {
      if (response !== undefined) {
      this.cliente = response1;
      }
    })
    if (this.cliente.length === 0) {
      swal('Consulta de Clientes', 'No se encontraron clientes, para los criterios de búsqueda especificados', 'warning');
      this.tblListaCliente = true;
    }else {
      this.tblListaCliente = false;
    }
    })
  }

  onKeydown(event) {
    console.log('event.keyCode',event.keyCode);
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
  }

  abrirModalCrearCliente() {
    this.isLoading = true;
    this.tipoIdentificacion = -1;
    $('#Ide').focus();
    $('#crearCliente').modal({
      keyboard: false,
      backdrop: 'static'
      });
      this.isLoading = false;
   }

   abrirModalEditarCliente(IdCliente: string) {
    this.isLoading = true;
    this._clienteService.consultarAdmonClienteParaModificar(IdCliente).subscribe( (response) => {
    this.isLoading = false;
      Promise.resolve(null).then(() =>  this.clienteEditar = response);
      console.log('this.clienteEditar1212', this.clienteEditar );
       $('#editarCliente').modal({
         keyboard: false,
         backdrop: 'static',
       })
    })

  }

}
