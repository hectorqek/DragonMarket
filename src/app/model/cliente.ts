import { TitularEditar, Titular } from "./titular";

export class Responsable {
  constructor(
    public TipoIdClienteResponsable: string,
    public IdClienteResponsable: string,
    public ApellidoResponsable: string,
    public NombreResponsable: string,
    public UsernameResponsable: string,
    public Clientes: Cliente[],
  ) { }
}
export class ResponsableConsulta {
  constructor(
    public TipoIdClienteResponsable: string,
    public IdClienteResponsable: string,
    public ApellidoResponsable: string,
    public NombreResponsable: string,
    public UsernameResponsable: string,
    public Clientes: Cliente[],
  ) { }
}
export class ResponsableRedistribucion {
  constructor(
    public TipoIdClienteResponsable: string,
    public IdClienteResponsable: string,
    public ApellidoResponsable: string,
    public NombreResponsable: string,
    public UsernameResponsable: string,
    public Clientes: ClienteRedistribucion[],
  ) { }
}

export class Cliente {
  constructor(
    public IdCliente: string,
    public ApellidoCliente: string,
    public NombreCliente: string,
    public CursoCliente: string,
    public ImagenCliente: string,
    public TotalSaldoBolsillos: Number,
    public ConsultarHistorico: Boolean,
    public Bolsillos: Bolsillo[]
  ) { }
}
export class ClienteRedistribucion {
  constructor(
    public IdCliente: string,
    public ApellidoCliente: string,
    public NombreCliente: string,
    public CursoCliente: string,
    public ImagenCliente: string,
    public TotalSaldoBolsillos: Number,
    public ConsultarHistorico: Boolean,
    public Bolsillos: BolsilloRedistribucion[]
  ) { }
}
export class Bolsillo {
  constructor(
    public IdBolsillo: string,
    public NombreBolsillo: string,
    public Saldo: number,
    public ValorRecarga: number,
    public clase: string
  ) { }
}


export class BolsilloRedistribucion {
  constructor(
    public IdBolsillo: string,
    public NombreBolsillo: string,
    public Saldo: number,
    public Valorless: number,
    public Valorplus: number,
    public SaldoFinal: number,
    public clase: string
  ) { }
}

export class ResponsableTransaccion {
  constructor(
    public TipoIdentificacion: string,
    public NumeroIdentificacion: string,
    public NombreResponsable: string,
    public UsernameResponsable: string
  ) { }

}
export class ClienteTransaccion {
  constructor(
    public IdCliente: string,
    public IdBilletera: string,
    public IdBolsillo: string,
    public NombreBolsillo: string,
    public ValorRecarga: number,
    public Origen: string,
    public Medio: string,
  ) { }
}

export class ClienteTransaccionRedistruccion {
  constructor(
    public IdCliente: string,
    public IdBilletera: string,
    public IdBolsillo: string,
    public ValorTransferencia: number,
  ) { }
}

export class TransaccionRedistribucion {
  constructor(
    public BilleteraClienteResponsableDT: ResponsableRedistribucion[],
    public BilleteraClienteOrigen: ClienteTransaccionRedistruccion[],
    public BilleteraClienteDestino: ClienteTransaccionRedistruccion[]
  ) { }
}


export class RecargaFinal {
  constructor(
    public responsableTransaccion: ResponsableTransaccion[],
    public cliente: ClienteTransaccion[]
  ) { }
}

export interface MedioPago {
  nombreMedioPago: string,
  abrv: string
  clase: string;
}
export interface HistorialTransaccion {
  IdRecarga: string;
  FechaRecarga: string;
  TrazabilityCode: string;
  Valor: number;
  Estado: string;
  TipoRecarga: string;
}

export interface HistorialRecarga {
  IdRecarga: string;
  FechaRecarga: string;
  NombreCliente: string;
  ValorRecarga: number;
  Medio: string;
}
export class ResponsableDevolucion {
  constructor(
    public Clientes: ClienteDevolucion[],
    public TotalSaldoBilletera: number
  ) { }
}
export class ClienteDevolucion {
  constructor(
    public IdCliente: string,
    public ApellidoCliente: string,
    public NombreCliente: string,
    public CursoCliente: string,
    public ImagenCliente: string,
    public TotalSaldoBolsillos: Number,
    public Bolsillos: BolsilloDevolucion[]
  ) { }
}
export class BolsilloDevolucion {
  constructor(
    public IdBolsillo: number,
    public NombreBolsillo: string,
    public Nota: string,
    public SaldoActual: number,
    public ValorAjuste: number = 0,

  ) { }
}
export class DevolucionTransaccion {
  constructor(
    public IdCliente: string,
    public IdBilletera: string,
    public IdBolsillo: number,
    public Origen: string,
    public NotaCredito: string
  ) { }
}
export class ConfirmacionReversion {
  constructor(
    public IdReversion: number,
    public IdClienteResponsable: string,
    public NombreResponsable: string,
    public FechaReversion: string,
    public Clientes: ClienteReversion[]
  ) { }
}
export class ClienteReversion {
  constructor(
    public IdCliente: string,
    public Nombre: string,
    public Bolsillos: BolsilloReversion[]
  ) { }
}
export class BolsilloReversion {
  constructor(
    public NombreBolsillo: string,
    public ValorReversionBolsillo: number,
    public SaldoInicial: number,
    public SaldoFinal: number
  ) { }
}
export class ConfirmacionDevolucion {
  constructor(
    public IdTransaccion: number,
    public FechaAjuste: string,
    public TotalAjuste: string,
    public Clientes: ClienteDevolucionConfirmacion[],
    public EstadoAjuste: string,
  ) { }
}
export class ClienteDevolucionConfirmacion {
  constructor(
    public IdCliente: string,
    public Nombre: string,
    public Bolsillos: BolsilloDevolucionConfirmacion[]
  ) { }
}
export class BolsilloDevolucionConfirmacion {
  constructor(
    public NombreBolsillo: string,
    public SaldoInicial: number,
    public ValorAjusteBolsillo: number,
    public SaldoFinal: number,
    public NotaCredito: string,
  ) { }
}
export class ClienteNotificacionReglas {
  constructor(
    public IdCliente: string,
    public NombreCliente: string,
    public ApellidoCliente: string,
    public CursoCliente: string,
    public ImagenCliente: string,
    public Bolsillos: BolsilloReglas[]
  ) { }
}
export class BolsilloReglas {
  constructor(
    public IdBolsillo: number,
    public NombreBolsillo: string,
    public Reglas: Reglas[]
  ) { }
}
export class Reglas {
  constructor(
    public IdRegla: number,
    public NombreRegla: string,
    public MontoItem: number,
    public EstadoRegla: boolean,
  ) { }
}
export class ReglasTransaccion {
  constructor(
    public IdCliente: string,
    public IdBolsillo: number,
    public IdRegla: number,
    public Valor: number,
    public Estado: boolean
  ) { }
}

/**
 * 
*/

export class ClienteReglaConsumo {
  constructor(
    public IdCliente: string,
    public NombreCliente: string,
    public ApellidoCliente: string,
    public CursoCliente: string,
    public ImagenCliente: string,
    public Bolsillos: BolsilloReglaConsumo[]
  ) { }
}
export class BolsilloReglaConsumo {
  constructor(
    public IdBolsillo: number,
    public NombreBolsillo: string,
    public ReglaConsumo: ReglaConsumo[]
  ) { }
}
export class ReglaConsumo {
  constructor(
    public IdRegla: number,
    public NombreRegla: string,
    public IdItemVenta: string,
    public NombreItemVenta: string,
    public MontoItem: number
  ) { }
}

export class ReglaConsumoVer {
  constructor(
    public IdCliente: string,
    public IdBolsillo: number,
    public IdRegla: number,
    public Valor: number,
    public Estado: boolean,
    public IdItemVenta: number,
    public Rutina: number,
    public Nombre: string
  ) { }
}

export class ReglaConsumoTransaccion {
  constructor(
    public IdCliente: string,
    public IdBolsillo: number,
    public IdRegla: number,
    public Valor: number,
    public Estado: boolean,
    public IdItemVenta: number,
    public Rutina: number
  ) { }
}

export class ReglaItemVenta {
  constructor(
    public IdItemVenta: number,
    public Nombre: string,
    public Cantidad: number
  ) { }
}

export class ReglaConsumoGuardar {
  constructor(
    public IdCliente: string,
    public IdBolsillo: number,
    public NombreCliente: string,
    public ApellidoCliente: string,
    public NombreBolsillo: string
    
  ) { }
}

export class AdmonClienteCrear {
  constructor(
    public IdCliente: string,
    public Nombre: string,
    public Apellido: string,
    public TipoCliente: string,
    public Celular: string,
    public Imagen: string,
    public PrecioEspecial: boolean,
    public Estado: boolean,
    public Titulares: TitularEditar[]
  ) { }
}

export class AdmonClienteEditar {
  constructor(
    public idCliente: string,
    public Nombre: string,
    public Apellido: string,
    public tipoCliente: string,
    public Celular: string,
    public Imagen: string,
    public precioEspecial: boolean,
    public Estado: boolean,
    public Titulares: TitularEditar[]
  ) { }
}

export class AdmonClienteConsulta {
  constructor(
    public IdCliente: string,
    public Nombre: string,
    public Apellido: string,
    public Imagen: string,
    public Estado: boolean
  ) { }
}
