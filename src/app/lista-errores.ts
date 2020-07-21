export class GestionErrores {
    private static Mensajes = {
        /* Reversiones */
        'RV0001': 'Ya se realizó una reversión para esta compra. ',
        'RV0000': 'Se realizó exitosamente la reversión para la compra seleccionada',
        'RV9999': 'Error en la reversión de la compra seleccionada',
    };
    public static getError (codigo) {

        let Texto = this.Mensajes[codigo];
        if (Texto === undefined) {
            Texto = 'Ha ocurrido un error. Consulte al administrador ' + codigo;
        };
        return Texto;
    };
    // tslint:disable-next-line:member-ordering
    private static Icono = {
        /* Reversiones */
        'RV0001': 'warning',
        'RV0000': 'success',
        'RV9999': 'error',
    };
    public static getIconError (codigo) {

        let Texto = this.Icono[codigo];
        if (Texto === undefined) {
            Texto = 'Ha ocurrido un error. Consulte al administrador ' + codigo;
        };
        return Texto;
    }
}

