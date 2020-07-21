
export class Menu {
constructor(
    public IdFuncionalidad: number,
    public IdRol: number,
    public NombreFuncionalidad: string,
    public Url: string,
    public Padre: number,
    public Tipo: string,
    public Orden: number,
    public HtmlId: string,
    public PermisoRol: boolean,
    public MenuHijos: MenuHijos[]
    ) { }
}
export class MenuHijos {
    constructor(
        public IdFuncionalidad: number,
        public IdRol: number,
        public NombreFuncionalidad: string,
        public Url: string,
        public Padre: number,
        public Tipo: string,
        public Orden: number,
        public HtmlId: string,
        public PermisoRol: boolean,
    ) {}
}
