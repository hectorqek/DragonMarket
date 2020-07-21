export class InformacionPOS {
    constructor(
        public IdPos: number,
        public NombrePos: string,
        public FechaInicio: string,
        public FechaFin: string,
        public Estado: string,
        public EstadoBoolean: boolean,
        public IdPeriodoTrabajo: number,
        public IdMenu: number,
        public NombreMenu: string,
        public IdConsecutivo: number
    ) {}
}
export class InformacionEstadoPOS {
    constructor(
        public IdPeriodoTrabajo: number,
        public Estado: string,
        public IdMenu: number,
        public Mensaje: string,
    ) {}
}
export class ListadoPOS {
    constructor(
        public $id: string,
        public IdPos: number,
        public NombrePos: string,
        public IdKiosco: number,
        public Kiosco: number,
        public POS_Usuario: []
    ) {}
}
export class MenuPos {
  constructor(
      public $id: string,
      public IdMenu: number,
      public NombreMenu: string,
      public ItemMenus: [],
  ) {}
}
export interface HistorialVenta {
    IdTransaccion: number;
    IdCliente: string,
    NombreCliente: string,
    ValorCompra: number,
    FechaCompra: string
}
export interface TirillaCierre {
    IdPeriodoTrabajo: number,
    NombrePOS: string,
    FechaInicio: string,
    FechaFin: string,
    Menu: string,
    Usuario: string,
    DetalleTirilla: DetalleTirilla[];
}
export interface DetalleTirilla {
    IdProducto: number,
    NombreProducto: string;
    CantidadInicial: number,
    CantidadIngresos: number,
    CantidadVendida: number,
    SaldoFinal: number;
}
