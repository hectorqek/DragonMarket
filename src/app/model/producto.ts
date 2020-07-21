export class ProductoBackend {
  constructor(
    public IdProducto: number,
    public NombreProducto: string,
    public SKU: string,
    public Perecedero: boolean,
    public Descripcion: string,
    public Orden: number,

  ) {}
}
export class Producto {
    constructor(
      public IdProducto: number,
      public NombreProducto: string,
      public NombrePlano: string,
      public SKU: string,
      public PerecederoB: boolean,
      public Perecedero: string,
      public Descripcion: string,
      public Orden: number,

    ) {}
}

export class CrearProducto {
  constructor(
      public IdProducto: number,
      public NombreProducto: string,
      public SKU: string,
      public Descripcion: string,
      public Perecedero: boolean,
  ) {}
}

export class ActualizarOrdenProducto {
  constructor(
    public IdProducto: number,
    public Orden: number,
  ) {}
}
