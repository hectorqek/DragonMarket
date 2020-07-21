import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { InventarioTransferencia, MensajeRespuesta } from '../../model/inventario';
import { Kiosco, DetalleKiosco } from 'app/model/kiosco';

import { ManejadorErroresPageModule } from 'app/pages/lista-errores';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  providers: [InventarioService],
  styleUrls: ['./transferencia.css']
})
export class TransferenciaComponent implements OnInit {
 

  /* Atributos */
  public isLoading: boolean;
  public listaKioscos: DetalleKiosco[];
  public listaProductosBC;
  public listaProductosKiosco: InventarioTransferencia[];
  public transferirdeBC: boolean;
  private inventarioSubscription: Subscription;
  public idKiosco: number;
  public nombreKioscoBCK: string;
  public nombreKioscoKBC: string;
  public valorBusqueda: string = '';

  constructor(private _inventario: InventarioService) {
    this.isLoading = false;
  }
  ngOnInit() {
    this.cargaListaKioscosBackend();
    this.transferirdeBC = true;

  }
  tipoTransaccion(event: any, varible: any ) {
    if (this.transferirdeBC === false) {
      this.nombreKioscoBCK = null;
      this.listaProductosKiosco = [];
      for (let i = 0; i < this.listaProductosKiosco.length; i++) {
        this.listaProductosKiosco[i].RetirarCantidad = 0;
      }
    } else {
      this.nombreKioscoKBC = null;
      this.listaProductosKiosco = [];
      for (let i = 0; i < this.listaProductosKiosco.length; i++) {
        this.listaProductosKiosco[i].AgregarCantidad = 0;
      }
    }
  }

  mensajeRespuesta(error: any[], cantidad: Number, titulo: String){
    let listadoErrores: any[] = [];
    for (let i = 0; i < error.length; i++) {
      let tmp: any[] = [];
      tmp.push(error[i].CodigoError);
      tmp.push(cantidad);
      listadoErrores.push(tmp);
    }
    let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, titulo);
    swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
  }
  descargaPerecederos() {
    if (this.transferirdeBC === false) {
      let listaProductoPerecederos: number = 0;
      for (let i = 0; i < this.listaProductosKiosco.length; i++) {
        if (this.listaProductosKiosco[i].Perecedero === true ) {
          if (this.listaProductosKiosco[i].Cantidad > 0) {
            this.listaProductosKiosco[i].AgregarCantidad = this.listaProductosKiosco[i].Cantidad
            this.listaProductosKiosco[i].NuevaCantidadKiosco = 
            Number(this.listaProductosKiosco[i].Cantidad) - Number(this.listaProductosKiosco[i].AgregarCantidad);
            this.listaProductosKiosco[i].NuevaCantidadBodegaCentral =
            Number(this.listaProductosKiosco[i].CantidadBodegaCentral) + Number(this.listaProductosKiosco[i].AgregarCantidad);
            listaProductoPerecederos += 1;
          }
        }
      }
      if (listaProductoPerecederos <= 0 ) {
        let errorNoCambio: any[] = [{'CodigoError': 'TRA-001'}]
        this.mensajeRespuesta(errorNoCambio, 0, 'Cantidad Insuficientes'  );

      } else {
        let errorNoCambio: any[] = [{'CodigoError': 'TRA-000'}]
        this.mensajeRespuesta(errorNoCambio, listaProductoPerecederos, 'Carga de Productos'  );
      }
    }
  }
  consultarInventarioKiosco(Kiosco) {
    let kiosco: Kiosco = JSON.parse(Kiosco);
    this.idKiosco = kiosco.IdKiosco;
    if (this.transferirdeBC === false) {
      this.nombreKioscoKBC = kiosco.NombreKiosco;
    } else {
      this.nombreKioscoBCK = kiosco.NombreKiosco;
    }
    this.consultarInventarioServicio(kiosco.IdKiosco);
  }
  /**
   *
   * @param IdKiosco
   * @returns El in ventario para un kiosco seleccionado, adicionalmente ejecuta la función que filtra
   * los productos.
   */
  consultarInventarioServicio(IdKiosco){
    this.inventarioSubscription = this._inventario.getInventarioTransferenciaBackend(IdKiosco).subscribe(
      (data) => { this.listaProductosKiosco = data; this.buscarProducto(this.valorBusqueda); },
      (error) => console.log('Error en Transferencia', error))
  }
  cargaListaKioscosBackend() {
    this._inventario.getListaKioscoBackend().subscribe(response => {
      this.listaKioscos = response;
    },
      error => console.error('Error', error)
    )
  }
  agregarantidades(item: InventarioTransferencia) {
    /*Calculo Kiosko */
    item.NuevaCantidadKiosco = Number(item.Cantidad) - Number(item.AgregarCantidad);
    item.NuevaCantidadBodegaCentral = Number(item.CantidadBodegaCentral) + Number(item.AgregarCantidad);
    /* Actualizar Nueva Cantidad */
  }
  retirarCantidades(item: InventarioTransferencia) {
    /*Calculo Kiosko */
    item.NuevaCantidadKiosco = Number(item.Cantidad) + Number(item.RetirarCantidad);
    item.NuevaCantidadBodegaCentral = Number(item.CantidadBodegaCentral) - Number(item.RetirarCantidad);
    /* Actualizar Nueva Cantidad */
  }
  buscarProducto(termino: string) {
     this.listaProductosKiosco = this._inventario.buscarProductoTransferencia(termino);
  }

  transferir() {
    this.isLoading = true;
    let listaProductoNegativos: any[] = [];
    let TuvoCambios: boolean = false;
    /* Caso uno Radio button en true */
    for (let i = 0; i < this.listaProductosKiosco.length; i++) {
      /* ¿ Existen  cambios en el campo Retirar Cantidad ? */
      if (Number(this.listaProductosKiosco[i].RetirarCantidad) !== 0 || Number(this.listaProductosKiosco[i].AgregarCantidad) !== 0) {
        TuvoCambios = true;
      }
      /* ¿ Retirar Cantidad tiene valores negativos ? */
      if (this.listaProductosKiosco[i].RetirarCantidad < 0) {
        let tmp: any[] = [];
        tmp.push(this.listaProductosKiosco[i].NombreProducto);
        listaProductoNegativos.push(tmp);
      }
      if (this.listaProductosKiosco[i].AgregarCantidad < 0) {
        let tmp: any[] = [];
        tmp.push(this.listaProductosKiosco[i].NombreProducto);
        listaProductoNegativos.push(tmp);
      }
    }
    if (TuvoCambios === false) {
      this.isLoading = false;
      let errorNoCambio: any[] = [{'CodigoError': 'INV8888'}]
      let listadoErrores: any[] = [];
      for (let i = 0; i < errorNoCambio.length; i++) {
        let tmp: any[] = [];
        tmp.push(errorNoCambio[i].CodigoError);
        tmp.push(errorNoCambio[i].NombreProducto);
        tmp.push(errorNoCambio[i].CantidadActual);
        listadoErrores.push(tmp);
      }
      let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Transferencias');
      swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
      return
    }
    if (listaProductoNegativos.length > 0) {
      let textoConsolidado: string = '';
      for (let j = 0; j < listaProductoNegativos.length; j++) {
        let texto = listaProductoNegativos[j][0];
        textoConsolidado = textoConsolidado + texto + '\n';
      }
      swal('Cantidad Final Menor a 0', 'Los siguientes productos tienen cantidad final inferior a 0:  \n \n' + textoConsolidado, 'error');
      this.isLoading = false;
      return
    }
    for (let i = 0; i < this.listaProductosKiosco.length; i++) {
      /* ¿ Existen  cambios en el campo Retirar Cantidad ? */
      // tslint:disable-next-line:max-line-length
      if (Number(this.listaProductosKiosco[i].NuevaCantidadBodegaCentral) < 0 || Number(this.listaProductosKiosco[i].NuevaCantidadKiosco) < 0) {
        let tmp: any[] = [];
        tmp.push(this.listaProductosKiosco[i].NombreProducto);
        listaProductoNegativos.push(tmp);
      }
    }
    if (listaProductoNegativos.length > 0) {
      let textoConsolidado: string = '';
      for (let j = 0; j < listaProductoNegativos.length; j++) {
        let texto = listaProductoNegativos[j][0];
        textoConsolidado = textoConsolidado + texto + '\n';
      }
      swal('Nuevas Cantidades  Invalidas', 'Bodega Central y Kiosco no pueden tener valores negativos:  \n \n'
      + textoConsolidado, 'error');
      this.isLoading = false;
      return
    }
    /* envío de petición a servicio */
    if (this.transferirdeBC === true) {
      this._inventario.transferencia(0, this.idKiosco).subscribe(
        response => {
          let listadoErrores: any[] = [];
          for (let i = 0; i < response.length; i++) {
            let tmp: any[] = [];
            tmp.push(response[i].CodigoError);
            tmp.push(response[i].NombreProducto);
            tmp.push(response[i].CantidadActual);
            listadoErrores.push(tmp);
          }
          let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Transferencias');
          swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
          this.consultarInventarioServicio(this.idKiosco);
           this.isLoading = false;
        },
        error => console.error('Error', error)
      );
    } else {
      this._inventario.transferencia(this.idKiosco, 0).subscribe(
        response => {
          let listadoErrores: any[] = [];
          for (let i = 0; i < response.length; i++) {
            let tmp: any[] = [];
            tmp.push(response[i].CodigoError);
            tmp.push(response[i].NombreProducto);
            tmp.push(response[i].CantidadActual);
            listadoErrores.push(tmp);
          }
          let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Transferencias');
          swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
          this.consultarInventarioServicio(this.idKiosco);
          this.isLoading = false;
        },
        error => console.error('Error', error)
      );
    }
  }
  abrirModalPlantillas() {
    $('#cargaPlantillas').modal({
      keyboard: false,
      backdrop: 'static',
    });
  }

  abrirModalGuardarPlantilla() {
      let listaProductoNegativos: any[] = [];
      let TuvoCambios: boolean = false;
      /* Caso uno Radio button en true */
      for (let i = 0; i < this.listaProductosKiosco.length; i++) {
        /* ¿ Existen  cambios en el campo Retirar Cantidad ? */
        if (Number(this.listaProductosKiosco[i].RetirarCantidad) !== 0 || Number(this.listaProductosKiosco[i].AgregarCantidad) !== 0) {
          TuvoCambios = true;
        }
        /* ¿ Retirar Cantidad tiene valores negativos ? */
        if (this.listaProductosKiosco[i].RetirarCantidad < 0) {
          let tmp: any[] = [];
          tmp.push(this.listaProductosKiosco[i].NombreProducto);
          listaProductoNegativos.push(tmp);
        }
        if (this.listaProductosKiosco[i].AgregarCantidad < 0) {
          let tmp: any[] = [];
          tmp.push(this.listaProductosKiosco[i].NombreProducto);
          listaProductoNegativos.push(tmp);
        }
      }
      if (TuvoCambios === false) {
        let errorNoCambio: any[] = [{'CodigoError': 'INV8888'}]
        let listadoErrores: any[] = [];
        for (let i = 0; i < errorNoCambio.length; i++) {
          let tmp: any[] = [];
          tmp.push(errorNoCambio[i].CodigoError);
          tmp.push(errorNoCambio[i].NombreProducto);
          tmp.push(errorNoCambio[i].CantidadActual);
          listadoErrores.push(tmp);
        }
        let resultado: MensajeRespuesta = ManejadorErroresPageModule.getErrors(listadoErrores, 'Transferencias');
        swal(resultado.Titulo, resultado.Cuerpo, resultado.Severidad);
        return
      }
      if (listaProductoNegativos.length > 0) {
        let textoConsolidado: string = '';
        for (let j = 0; j < listaProductoNegativos.length; j++) {
          let texto = listaProductoNegativos[j][0];
          textoConsolidado = textoConsolidado + texto + '\n';
        }
        swal('Cantidad Final Menor a 0', 'Los siguientes productos tienen cantidad final inferior a 0:  \n \n' + textoConsolidado, 'error');
        return
      }
      $('#guardarPlantilla').modal({
        keyboard: false,
        backdrop: 'static',
      });
  }


}
