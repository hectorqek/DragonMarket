import { Inventario } from './inventario';

export class Kiosco {
    constructor(
      public $Id: number,
      public IdKiosco: number,
      public NombreKiosco: string,
      public Inventarios: Inventario[],
      public MovimientoInventarios: Inventario[],
      public POS: any,

    ) {}
}

export class DetalleKiosco {
  constructor(
    public IdKiosco: number,
    public NombreKiosco: string,
    public Estado: string,
    public FlagBodega: boolean
  ) {}
}

