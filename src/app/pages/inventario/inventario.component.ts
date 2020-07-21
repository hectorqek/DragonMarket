import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Inventario, MensajeRespuesta } from '../../model/inventario';
import { Router } from '@angular/router';
import { UrlService } from 'app/services/sidebar.service';
import { Subscription } from 'rxjs';
import { ManejadorErroresPageModule } from '../lista-errores';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  providers: [InventarioService]
})
export class InventarioComponent implements OnInit, OnDestroy {

  public Usuario: string;
  /* Kioscos */
  public listInventario: number = 1;
  public idKiosco: number;
  /* Inevntario */
  public inventario: Inventario[] ;
  public input =  document.getElementById('numero');
  public vacio: boolean = true;
  public isLoading = false;
  /* Subcripcion */
  private consultarPermisoSubcription: Subscription;
  private inventarioSubscription: Subscription;
  private observableInventarioSubscription: Subscription;
  public valorBusqueda: string = '';


  constructor( private _inventarioService: InventarioService,
               private _router: Router,
               private _sidebar: UrlService
              ) {  }

  ngOnInit() {
    this.consultarPermisoSubcription = this._sidebar.consultarPermisos(this._sidebar.getPath()).subscribe();
    this.Usuario = sessionStorage.getItem('Usuario');
    this.cargaInventarioBackend(0);

  }

  cargaInventarioBackend(idKiosco: number) {
    idKiosco = 0;
    this.inventarioSubscription = this._inventarioService.getInventarioBackend(idKiosco)
    .subscribe( respuesta => { this.inventario = respuesta; this.buscarProducto(this.valorBusqueda)  },
                error => console.error('Error', error)
    );
    this.observableInventarioSubscription  = this._inventarioService.inventarioService$
    .subscribe( respuesta => { this.inventario = respuesta },
      error => console.error('Error', error)
);
  }
  buscarProducto( termino: string) {
    this.inventario = this._inventarioService.buscarProducto( termino );
  }

  actualizarCantidadFinal(item: Inventario) {
    if (item.AgregarCantidad !== 0 || item.RetirarCantidad !== 0) {
      this.vacio = false;
    }
    item.CantidadFinal = Number(item.CantidadFinal);
    item.CantidadFinal = 0;
    item.CantidadFinal = Number(item.Cantidad) + Number(item.AgregarCantidad) -  Number(item.RetirarCantidad);
  }
  actualizarInventario() {
    this.vacio = true;
    this.isLoading = true;
    let menorCero: boolean = false;
    let listaProductoNegativos: any[] = [];
    for (let i = 0; i < this.inventario.length; i++) {
      if ( this.inventario[i].CantidadFinal < 0 ) {
        menorCero = true;
        this.isLoading = false;
        let tmp: any[] = [];
        tmp.push(this.inventario[i].NombreProducto);
        listaProductoNegativos.push(tmp);
        let textoConsolidado: string = '';
        for (let j = 0; j < listaProductoNegativos.length; j++) {
            let texto = listaProductoNegativos[j][0];
            textoConsolidado = textoConsolidado + texto + '\n';
        }
        // tslint:disable-next-line:max-line-length
        swal('Cantidad Final Menor a 0', 'Los siguientes productos tienen cantidad final inferior a 0, revise por favor:  \n \n' + textoConsolidado, 'error');
        }
    }
    if (menorCero !== true) {
    this._inventarioService.actualizarInventario().subscribe(
      response => {
        let listadoErrores: any[] = [];
        for (let i = 0 ; i < response.length; i++) {
            let tmp: any[] = [];
            tmp.push(response[i].CodigoError);
            tmp.push(response[i].NombreProducto);
            tmp.push(response[i].CantidadActual);
            listadoErrores.push(tmp);
        }
        let resultado: MensajeRespuesta =  ManejadorErroresPageModule.getErrors(listadoErrores, 'Inventario');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
        this.cargaInventarioBackend(this.idKiosco);
        this.isLoading = false;
      },
      error => console.error('Error', error)
      );
    }
};

  ngOnDestroy() {
    this.consultarPermisoSubcription.unsubscribe();
    this.inventarioSubscription.unsubscribe();
    this.observableInventarioSubscription.unsubscribe();
  }
}
