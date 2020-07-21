import { MensajeRespuesta } from '../model/inventario';

export class ManejadorErroresPageModule {
    private static Mensajes= {
        'INV0000' : 'Actualización de Inventario Exitosa',
        'INV0001' : 'Error al actualizalizar el inventario',
        'INV0008' : 'Ya existe el nombre de plantilla ingresado',
        'INV8888' : 'No hay cambios en el inventario para registrar',
        'INV8889' : 'Bodega Central y Kiosco no pueden tener valores negativos:  \n \n',
        'INV8000' : 'Carga de Plantilla Exitosa',
        'INV8001' : 'No se cargo contenido de Plantilla, Comuniquese con Administrador:  \n \n',
        'T0000'   : 'Operación Ok',
        'T9999'   : 'Error general (no controlado)',
        'T0001'   : 'El valor de origen y destino no coinciden.',
        'T0002'   : 'El responsable no existe',
        'T0003'   : 'El valor Origen es menor o igual a 0',
        'T0004'   : 'Valor inválido. El valor Destino es menor o igual a 0',
        'T0005'   : 'Valor inválido. No existe un origen',
        'T0006'   : 'Valor inválido. No existe un destino',
        'T0007'   : 'Valor inválido. La suma de los bolsillos de origen es diferente a la destino',
        'T0008'   : 'Valor inválido. El saldo del bolsillo es menor al que voy a transferir',
        'R0000'   : 'Ajuste Exitoso',
        'R0003'   : 'Valor del ajuste mayor al saldo actual',
        'R0001'   : 'Valor del ajuste menor o igual a 0',
        'R0002'   : 'No existe el cliente',
        'R9999'   : 'Error General',
        'PR0000'  : 'Se creo el producto correctamente',
        'PR0001'  : 'Se actualizó correctamente el producto',
        'PR0002'  : 'Ya existe el SKU Ingresado',
        'PR0003'  : 'Nombre del producto ya existe',
        'PR9999'  : 'Error General',
        'RG0000'  : 'Operación Exitosa',
        'RG0003'  : 'El producto ya esta agregado',
        'RG9999'  : 'Error General',
        'RG-001'  : 'El consumo máximo por día debe ser mayor a 0',
        'IVT0000' : 'Operación Exitosa',
        'IVT0004' : 'Nombre ItemVenta Ya existe',
        'IVT0005' : 'No tiene productos Asociados',
        'IVT0006' : 'No tiene categorias asociadas',
        'IVT0007' : 'No tiene menu asociado',
        'IVT0008' : 'Id Item No existe',
        'IVT8001' : 'Precio de Venta no puede ser negativo',
        'IVT8002' : 'Precio Especial no puede ser negativo',
        'IVT8003' : 'Precio Descuento no puede ser negativo',
        'IVT9999' : 'Error General',
        'P0000'   : 'Operación Realizada Exitosamente',
        'P0001'   : 'Ya existe un Periodo de Trabajo Abierto',
        'P0002'   : 'No existe Periodo de Trabajo Abierto, por favor seleccione un menú',
        'P9999'   : 'Error General',
        'TRA-000' : 'Se prelleno el campo Cantidad para',
        'TRA-001' : 'No hay cantidades suficientes ',
        'DV0001'  : 'Devolución Exitosa',
        'V0000' : 'Venta Exitosa',
        'V0001' : 'Existencias Insuficiente',
        'V0002' : 'Cliente NO existe',
        'V0003' : 'Saldo Insuficiente',
        'V0004' : 'El POS No existe',
        'V0005' : 'El POS se encuentra Cerrado',
        'V0006' : 'Monto Máximo superado por día',
        'V0007' : 'Monto superado por día',
        'V0008' : 'El usuario tiene limite de consumo para los siguientes productos:',
        'V0009' : 'El usuario no tiene Sobre Giro Autorizado'
    };
    private static Detalle = {
        'INV0000' : '',
        'INV0001' : 'Sólamente hay {2} unidades de {1}',
        'INV0008' : '',
        'INV8888' : '',
        'INV8889' : '',
        'INV8000' : '',
        'INV8001' : '',
        'T0000'   : '',
        'T0003'   : '',
        'T0004'   : '',
        'T0005'   : '',
        'T0006'   : '',
        'T0007'   : '',
        'T0008'   : '',
        'R0000'   : '',
        'R0001'   : '',
        'R0002'   : '',
        'R0003'   : '',
        'R9999'   : '',
        'PR0000'  : '',
        'PR0001'  : '',
        'PR0002'  : '',
        'PR0003'  : '',
        'PR9999'  : '',
        'RG0000'  : '',
        'RG0003'  : '',
        'RG9999'  : '',
        'RG-001'  : '',
        'IVT0000' : '',
        'IVT0004' : '',
        'IVT0005' : '',
        'IVT0006' : '',
        'IVT0007' : '',
        'IVT0008' : '',
        'IVT8001' : '',
        'IVT8002' : '',
        'IVT8003' : '',
        'IVT9999' : '',
        'P0000'   : '',
        'P0001'   : '',
        'P0002'   : '',
        'P9999'   : '',
        'TRA-000'  : '{1} productos perecederos. Por favor realice la transferencia a  Bodega Central',
        'TRA-001'  : 'en productos perecederos para descargar',
        'DV0001'  : '',
        'V0000' : 'La venta se realizó correctamente',
        'V0001' : 'No hay existencias suficiente del producto seleccionado',
        'V0002' : 'El cliente no se encuentra registrado',
        'V0003' : 'Saldo Insuficiente para realizar compra',
        'V0004' : 'El POS enclado no se encuentra registrado comuniquese con Mesa de Ayuda',
        'V0005' : 'El POS se encuentra Cerrado, debe abrir un nuevo periodo de trabajo',
        'V0006' : 'El valor total de la compra, supera el máximo permitido para el usuario que es: {2}' ,
        'V0007' : 'El usuario ya consumió el monto permitido por día que es: {2}',
        'V0008' : '{1} Cantidad permitida por día:  {3}',
        'V0009' : 'No tiene activo el beneficio de Sobre Giro'
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
        'DV0001' : 'success',
        'V0000' : 'success',
        'V0001' : 'warning',
        'V0002' : 'Producto',
        'V0003' : 'warning',
        'V0004' : 'warning',
        'V0005' : 'error',
        'V0006' : 'warning',
        'V0007' : 'warning',
        'V0008' : 'warning',
        'V0009' : 'warning'
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



