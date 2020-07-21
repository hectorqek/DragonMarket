/**
Clase definida para tener de manera global la URL
de acceso al Backend de la aplicación
**/
export let GLOBAL = {

    /** Producción */
    // url:   'https://dragonmarketapi.sgs.edu.co/api/',
    // urlValidacion: 'https://dragonmarket.azurewebsites.net',
    // urlReportes: 'https://dragonmarketreportes.azurewebsites.net/PaginaVisora.aspx?UR=Reportes/DragonMarket/',

    /** UAT */
    url:   'http://localhost:49349/api/',
    //url:   'https://dragonmarketapifun.sgs.edu.co/api/',
    urlValidacion: 'https://dragonmarketfun.azurewebsites.net',
    urlReportes: 'https://naranjareportes.azurewebsites.net/PaginaVisora.aspx?UR=Reportes/DragonMarket/',

    version: '1.2.5'
};

export let BLOB = {
    url: 'https://naranja.blob.core.windows.net/dragonmarket/'
};

export let UlrAutorizacionACUMEN = {
    url: 'https://dragonmarketapifun.sgs.edu.co/api/autorizacion'
};

export class globalAuthorized {
    authorized: boolean = false;
}

