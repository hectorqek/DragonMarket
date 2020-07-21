import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ClienteService } from 'app/services/cliente.service';
import { Observable ,  Subject } from 'rxjs';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html'
})
export class ConsultarClienteComponent implements OnInit {

   /* Variables para Busqueda */
   public  clients: Observable<any[]>
   private busquedaCliente$ = new Subject<string>();
   public  ClientName = '';
   public  flag: boolean = true;
   @Output() IdCliente: EventEmitter<string> = new EventEmitter();



   constructor(private _clienteService: ClienteService) { }

  ngOnInit() {
    this.clients = this.busquedaCliente$
    .pipe(debounceTime(300))
    .pipe(distinctUntilChanged())
    .pipe(switchMap(term => term
      ? this._clienteService.search(term)
      : of<any[]>([])))
    .pipe(catchError(error => {
      console.log(error);
      return of<any[]>([]);
  }));
  }
  buscarCliente(term: string): void {
    this.flag = true;
    this.busquedaCliente$.next(term);
  }
  seleccionarUsuario(IdCliente) {
    this.IdCliente.emit(null);
  }
  reImprimir(){
    let printContents, popupWin, infoCliente;
    popupWin = window.open('', '_blank', 'height=1,width=1');
    popupWin.document.open();
    popupWin.document.write(localStorage.getItem('impresionRecargas'));
    popupWin.document.close();
   }

}
