export class Venta {
    constructor(
      public IdCliente: string,
      public VentaTotal: number,
      public Usuario: string,
      public idPOS: number,
      public itemVentaDTO?: string,
    ) {}
}
export interface ResultadoTransaccion {
  IdTransaccion: string;
  FechaCompra: string;
  NuevoSaldo: number;
  CodigoError: string;
 }




