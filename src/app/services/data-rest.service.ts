import { Injectable } from '@angular/core';
import { CoreRestService } from './core-rest.service';
import { Logger } from './logger.service';
import { CodigoPostal } from '../models/atoms/CodigoPostal';
import { Observable } from 'rxjs';
import { Opcion } from '../models/atoms/Opcion';
import { Domicilio } from '../models/atoms/Domicilio';
import { Promociones } from '../models/atoms/Promociones';
import { CotizacionParams } from '../models/atoms/CotizacionParams';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class DataRestService {
  private cp: CodigoPostal;

  constructor(
    private logger: Logger,
    private apicore: CoreRestService
  ) {
  }

  /* 1. Datos basicos del contratante ********************************/

  getProducto(): Observable<any> {
    return this.apicore.get(`screen0/producto`);
  }

  getTipoMoneda(idMoneda): Observable<any> {
    return this.apicore.get(`screen0/moneda/${idMoneda}`);
  }

  getAccesoSesion(): Observable<any> {
    return this.apicore.get(`screen0/validacion/hora-acceso`);
  }

  getCodigoPostal(cp: number): Observable<any> {
    return this.apicore.get(`screen0/codigo-postal/${cp}`);
  }

  listSiNoOpcion(): Observable<any> {
    let lista = [
      // new Opcion("", "Selecciona una opción", false),
      new Opcion("1", "Si", false),
      new Opcion("0", "No", false)
    ]
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(lista);
      }, 1000);
    });
  }

  getRestriccionEstado(cveEstado: number): Observable<any> {
    return this.apicore.get(`screen1/restriccion-venta/estado/${cveEstado}`);
  }

  getRestriccionCP(CP: number): Observable<any> {
    return this.apicore.get(`screen1/restriccion-venta/codigo-postal/${CP}`);
  }

  validarDomicilio(domicilio: Domicilio): Observable<any> {
    return this.apicore.post(domicilio, `screen1/validacion/domicilio-unico`);
  }

  validarBinBanco(bin: number): Observable<any> {
    return this.apicore.get(`screen1/validacion/bin-banco/${bin}`);
  }

  validarTipocliente(numCuenta: string): Observable<any> {
    return this.apicore.get(`screen1/perfil/tipo-cliente`);
  }

  getPerfilCliente(numCuenta: string): Observable<any> {
    return this.apicore.get(`screen1/perfil/cliente/${numCuenta}`);
  }

  getTipoCliente(numCuenta: string): Observable<any> {
    return this.apicore.get(`screen1/perfil/tipo-cliente/${numCuenta}`);
  }

  /* 2. Ubicación del inmueble  ***************************************/

  listTipoVivienda(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/TIPVIV`);
  }

  listDescripcionVivienda(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/DESVIV`);
  }

  listSituacionVivienda(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/FINDES`);
  }

  listTipoConstruccion(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/TIPCON`);
  }

  listIrregularidadPlanta(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/SUSEDI`);
  }

  listCercaniaAlMar(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/CERFTE`);
  }

  listCercaniaLagoLagunaRio(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/ANTDES`);
  }

  listCercaniaPostes(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/CERPOS`);
  }

  listAntiguedad(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/ANOANT`);
  }

  listTipoRemodelacion(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/REMTIP`);
  }

  listMedidasSeguridad(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/SISSEG`);
  }

  listCabecerasModalInmueble(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/COTWIN-N1`);
  }

  listDatosModalInmueble(): Observable<any> {
    return this.apicore.get(`screen2/tc-catalog/tabla-valor-inmueble`);
  }

  getHtml(htmlpath: string): Observable<any> {
    return this.apicore.getHTML(htmlpath);
  }

  validaLimiteConstruccion(): Observable<any> {
    return this.apicore.get(`screen2/tc-opc-app/limites-construccion`);
  }

  validaLimiteContenido(): Observable<any> {
    return this.apicore.get(`screen2/tc-opc-app/limites-contenido`);
  }

  /* 3. Cotización  ***************************************/

  validaTipoUsuario(tipoUser): Observable<any> {
    return this.apicore.get(`screen3/restriccion-venta/usuario/${tipoUser}`);
  }

  listFormasPago(): Observable<any> {
    return this.apicore.get(`screen3/formas-de-pago`);
  }

  listTipoPlanes(): Observable<any> {
    return this.apicore.get(`screen3/tc-catalog/planes`);
  }

  listCoberturasOpcionales(): Observable<any> {
    return this.apicore.get(`screen3/tc-catalog/coberturas-opcionales`);
  }

  listPagosPlanes(params: CotizacionParams): Observable<any> {
    return this.apicore.post(params, `screen3/cotiza-planes`);
    // let lista = [
    //   {
    //   nomPago: "Primer pago:", cvePago:"primer_pago", 
    //   elementos: [
    //   { cvePlan: 1, monto: "985.73" },
    //   { cvePlan: 2, monto: "N/A" },
    //   { cvePlan: 3, monto: "882.29" },
    //   { cvePlan: 4, monto: "882.29" }
    //   ]
    // },
    // {
    //   nomPago: "Pago sub.(s):", cvePago:"pago_subs", 
    //   elementos: [{ cvePlan: 1, monto: "0.00" },
    //   { cvePlan: 2, monto: "N/A" },
    //   { cvePlan: 3, monto: "0.00" },
    //   { cvePlan: 4, monto: "0.00" }
    //   ]
    // },
    // {
    //   nomPago: "Prima total:", cvePago:"prima_total", 
    //   elementos: [{ cvePlan: 1, monto: "985.73" },
    //   { cvePlan: 2, monto: "N/A" },
    //   { cvePlan: 3, monto: "882.29" },
    //   { cvePlan: 4, monto: "882.29" }
    //   ]
    // },
    // {
    //   nomPago: "Prima neta:", cvePago:"prima_neta", 
    //   elementos: [
    //   { cvePlan: 1, monto: "1,000" },
    //   { cvePlan: 2, monto: "2,000" },
    //   { cvePlan: 3, monto: "3,000" },
    //   { cvePlan: 4, monto: "4,000" }
    //   ]
    // },
    // {
    //   nomPago: "Diferencia de precios:", cvePago:"dif_precios",
    //   elementos: [{ cvePlan: 1, monto: "0.00" },
    //   { cvePlan: 2, monto: "N/A" },
    //   { cvePlan: 3, monto: "0.00" },
    //   { cvePlan: 4, monto: "0.00" }
    //   ]
    // }];

    // return new Observable(subscriber => {
    //   setTimeout(() => {
    //     subscriber.next(lista);
    //   }, 1000);
    // });
  }

  listTablaCoberturas(): Observable<any> {
    return this.apicore.get(`screen3/tc-catalog/tabla-coberturas`);
  }

  getIdUsuarioVenta(tipoUsuario: String): Observable<any> {
    return this.apicore.get(`screen3/id-usuario-venta/${tipoUsuario}`);
  }

  getDescuento(promo: Promociones): Observable<any> {
    return this.apicore.post(promo, `screen3/descuento`);
  }

  public getPDFCotizacion(numCotizacion: string): Observable<any> {
    /*  return this.apicore.get(`screen3/descuento`).pipe(
        map((response: any) => `data:application/pdf;base64,${response}`)
    ); */
    return this.apicore.getArrayBuffer(`screen3/formato-cotizacion/${numCotizacion}`);
  }

}
