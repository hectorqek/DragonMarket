export class ItemVenta {
    constructor(
      public IdItemVenta: number,
      public PrecioVenta: number,
      public Cantidad: number,
      public Nombre: string,
      public Imagen: string,
      public PrecioDescuento: number,
      public PrecioEspecial: number,
      public SubTotal: number
    ) {}
}

export class GestionItemVenta {
  constructor(
    public IdItemVenta: number,
    public Nombre: string,
    public Imagen: string,
    public PrecioVenta: number,
    public PrecioEspecial: number,
    public PrecioDescuento: number,
    public EstadoDescuento: boolean,
    public EstadoItemVenta: boolean,
  ) {}
}

export class Categoria {
  constructor(
    public $id: string,
    public IdCategoria: number,
    public NombreCategoria: string,
    public Orden: number,
    public ItemCategorias: [],
  ) {}
}

export class CrearItemVenta {
  constructor(
    public IdItemVenta: number,
    public Nombre: string,
    public Imagen: string,
    public PrecioVenta: number,
    public PrecioEspecial: number,
    public PrecioDescuento: number,
    public EstadoDescuento: boolean,
    public EstadoItemVenta: boolean
  ) {} 
}

export class EditarItemVenta {
  constructor(
    public IdItemVenta: number,
    public NombreItemVenta: string,
    public ImagenItemVenta: string,
    public PrecioVenta: number,
    public PrecioEspecial: number,
    public PrecioDescuento: number,
    public EstadoDescuento: boolean,
    public EstadoItemVenta: boolean,
    public ItemsCategoria: [],
    public ItemsProducto: [],
    public ItemsMenu: []
    
  ) {}
}

export class ItemVentaCompleto {
  constructor(
    public IdItemVenta: number,
    public NombreItemVenta: string,
    public ImagenItemVenta: string,
    public PrecioVenta: number,
    public PrecioDescuento: number,
    public PrecioEspecial: number,
    public EstadoDescuento: boolean,
    public EstadoItemVenta: boolean,
    public ItemsProducto: ItemProducto[],
    public ItemsCategoria: ItemCategoria[],
    public ItemsMenu: ItemMenu[]

  ) {}
}
export class ItemProducto {
  constructor(
    public IdProducto: number,
    public NombreProducto: string,
    public Cantidad: number
  ) {}
}
export class ItemCategoria {
  constructor(
    public IdCategoria: number,
    public NombreCategoria: string
  ) {}
}
export class ItemMenu {
  constructor(
    public IdMenu: number,
    public NombreMenu: string
  ) {}
}

export class ItemLista {
  constructor(
    public id: number,
    public nombre: string
  ) {}
}

export class ProductoItem {
  constructor(
    public id: number,
    public nombre: string,
    public cantidad: number
  ){}
}

