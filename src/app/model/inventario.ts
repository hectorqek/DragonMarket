import { TirillaCierre } from './pos';
export class Inventario {
    constructor(
      public IdProducto: number,
      public NombreProducto: string,
      public IdKiosco: number,
      public NombreKiosco: string,
      public Cantidad: number,
      public IdKioscoNuevo: string,
      public AgregarCantidad: number = 0,
      public RetirarCantidad: number = 0,
      public CantidadFinal: number = 0


    ) {}
}

export class ItemInventario {
  constructor(
    public Cantidad: number,
    public IdKiosco: number,
    public IdKioscoNuevo: string,
    public IdProducto: number
  ) {}
}

export class InventarioTransaccion {
  constructor(
    public Usuario: string,
    public ItemInventario?: string
  ) {}
}

export interface RespuestaInventarioBackend {
  CodigoError: string,
  IdProducto: number;
  NombreProducto: string,
  CantidadActual: number,

}

export class MensajeRespuesta {
  constructor(
  public Titulo: string,
  public Cuerpo: string,
  public Severidad: string,
  ) {}
}

export class InventarioBackendKiosco {
  constructor(
    public IdProducto: number,
    public NombreProducto: string,
    public IdKiosco: number,
    public NombreKiosco: string,
    public Cantidad: number,
    public IdKioscoNuevo: number,
    public CantidadBodegaCentral: number,
    public Perecedero: boolean
  ) {}
}
export class InventarioTransferencia {
    constructor(
      public IdProducto: number,
      public NombreProducto: string,
      public CantidadBodegaCentral: number,
      public Cantidad: number,
      public AgregarCantidad: number = 0,
      public RetirarCantidad: number = 0,
      public NuevaCantidadKiosco: number = 0,
      public NuevaCantidadBodegaCentral: number = 0,
      public Perecedero: boolean
    ) {}
}
export class Plantilla {
  constructor(
    public IdPlantilla: number,
    public NombrePlantilla: string,
  ) {}
}

export class InfoPlantila {
  constructor(
    public IdPlantilla: number,
    public IdProducto: number,
    public Cantidad: number
  ) {}
}

export class CrearPlantilla {
  constructor(
    public IdPlantilla: number,
    public NombrePlantilla: string,
  ) {}
}

export class ItemPlantilla {
  constructor(
    public IdProducto: number,
    public Cantidad: number
  ) {}
}

