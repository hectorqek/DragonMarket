export class Titular {
    constructor(
      public TipoIdClienteResponsable: string,
      public IdClienteResponsable: string,
      public Nombres: string,
      public Apellidos: string,
      public Username: string,
      public Estado: boolean,
      public DescripcionTipoIdClienteResponsable: string,
      public DescripcionEstado: string,
      public NombreCompleto: string
    ) {}
}

export class TitularEditar{
  constructor(
    public TipoIdClienteResponsable: string,
    public IdClienteResponsable: string,
    public Nombres: string,
    public Apellidos: string,
    public Username: string,
    public Estado: boolean
  // tslint:disable-next-line: one-line
  ){}
}

export class TitularCrear{
  constructor(
    public TipoIdClienteResponsable: string,
    public IdClienteResponsable: string,
    public Nombres: string,
    public Apellidos: string,
    public Username: string,
    public Estado: boolean
  // tslint:disable-next-line: one-line
  ){}
}