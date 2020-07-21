import { MensajeRespuesta } from '../model/inventario';

export class ManejadorErroresPageModule {
    private static Mensajes= {
        '"V0001"' : 'No hay existencias suficiente del producto seleccionado',
        '"V0002"' : 'Producto',
        '"V0003"' : 'Saldo Insuficiente',
        '"V0004"' : 'El POS No existe',
        '"V0005"' : 'El POS se encuentra Cerrado',
        '"V0006"' : 'El valor total de la compra, supera el máximo permitido para el usuario',
        '"V0007"' : 'El usuario ya consumio el monto permitido por día',
        '"V0008"' : 'El usuario tiene limite de consumo'
    };
    private static Detalle = {
        '"V0001"' : 'No hay existencias suficiente del producto seleccionado',
        '"V0002"' : 'Producto',
        '"V0003"' : 'Saldo Insuficiente',
        '"V0004"' : 'El POS No existe',
        '"V0005"' : 'El POS se encuentra Cerrado',
        '"V0006"' : 'El valor total de la compra, supera el máximo permitido para el usuario',
        '"V0007"' : 'El usuario ya consumio el monto permitido por día',
        '"V0008"' : 'El usuario tiene limite de consumo'
    };
    private static Severidad = {
        'INV0000' : 'success',
        'INV0001' : 'warning',
        'INV0008' : 'warning',
        'INV8888' : 'warning',
        'INV8889' : 'warning',
        'INV8000' : 'success',
        'INV8001' : 'error',
        'T0000'   : 'success',
        'T0003'   : 'warning',
        'T0004'   : 'warning',
        'T0005'   : 'warning',
        'T0006'   : 'warning',
        'T0007'   : 'warning',
        'T0008'   : 'warning',
        'R0000'   : 'success',
        'R0001'   : 'warning',
        'R0002'   : 'warning',
        'R0003'   : 'warning',
        'R9999'   : 'warning',
        'PR0000'  : 'success',
        'PR0001'  : 'success',
        'PR0002'  : 'warning',
        'PR0003'  : 'warning',
        'PR9999'  : 'error',
        'RG0000'  : 'success',
        'RG0003'  : 'warning',
        'RG9999'  : 'error',
        'RG-001'  : 'warning',
        'IVT0000' : 'success',
        'IVT0004' : 'warning',
        'IVT0005' : 'warning',
        'IVT0006' : 'warning',
        'IVT0007' : 'warning',
        'IVT0008' : 'warning',
        'IVT8001' : 'warning',
        'IVT8002' : 'warning',
        'IVT8003' : 'warning',
        'IVT9999' : 'error',
        'P0000'   : 'success',
        'P0001'   : 'warning',
        'P0002'   : 'warning',
        'P9999'   : 'error',
        'TRA-000'  : 'success',
        'TRA-001'  : 'warning',
        'DV0001' : 'success'
    };
    public static getError (codigo) {

        let Texto = this.Mensajes[codigo];
        if (Texto === undefined) {
            Texto = 'Ha ocurrido un error. Consulte al administrador ' + codigo;
        };
        return Texto;
    }
    public static getErrors (lista: any[], titulo ) {
        let textoConsolidado: string = '';
        let severidad: string;
        let encabezado: string = '';
        for (let i = 0; i < lista.length; i++) {
            encabezado = this.Mensajes[lista[i][0]];
            let texto = this.Detalle[lista[i][0]];
            severidad = this.Severidad[lista[i][0]];
            for (let j = 1; j < lista[i].length ; j++) {
                texto = texto.replace('{' + j + '}', lista[i][j]);
            }
            textoConsolidado = textoConsolidado + texto + '\n';
        }
        if (textoConsolidado === '' ) {
            textoConsolidado = 'Ha ocurrido un error. Consulte al administrador';
            severidad = 'warning'
        }
        let resultado: MensajeRespuesta ;
        resultado = new MensajeRespuesta(titulo, encabezado + '\n' + textoConsolidado, severidad)
        return resultado;
    }

}

