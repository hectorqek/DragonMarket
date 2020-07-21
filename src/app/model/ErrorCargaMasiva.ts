export interface MensajeRespuestaCargaMasiva {
    codigo: string,
    mensaje: ErrorCargaMasiva[]
}

export interface ErrorCargaMasiva {
    fila: number,
    id: string,
    mensaje: string
}