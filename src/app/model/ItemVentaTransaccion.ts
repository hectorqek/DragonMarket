export class ItemVentaTransaccion {
    constructor(
      public IdItemVenta: number,
      public Nombre: string,
      public Cantidad: number,
      public PrecioVenta: number,
      public SubTotal: number,
      public cantidadActual: number,
    ) {}
}
