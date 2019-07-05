import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { Tooltip } from '../models/atoms/Tooltip';

@Injectable({
  providedIn: 'root'
})


export class ValidacionesService {

  constructor(
    private logger: Logger
  ) {

  }

  isEmpty(textoValue: any) {
    if (textoValue === null || textoValue === undefined || textoValue === "") {
      return true;
    }
    return false;
  }

  isEmptyObject(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

getBrowser(): string{
  this.logger.log("getBrowser");
  this.logger.log(window.navigator.userAgent);

  var browsers = {
      chrome: /chrome/i, 
      safari: /safari/i, 
      firefox: /firefox/i,
      ie: /internet explorer|msie|trident|edge/i
    };

        for(var key in browsers) {
            if (browsers[key].test(window.navigator.userAgent)) {
                return key;
            }
       };

       return 'unknown';
}

  replaceSymbols(texto: string, symbol: string): string {
    return texto.replace(symbol, '');
  }

  getTipoPagoCuenta(numCuenta: string): number {
    if (!this.isEmpty(numCuenta)) {
      if (numCuenta.length == 16) {
        return 1;
      } else if (numCuenta.length == 10) {
        return 2;
      } else {
        return 0;
      }
    }
  }

  validaCuentaDigVerificador(numCuenta: string): boolean {
    let ultimoDig: number;

    ultimoDig = Number(numCuenta[numCuenta.length - 1]);

    this.logger.log("validaCuentaDigVerificador");
    this.logger.log("ultimoDig: " + ultimoDig);

    if (this.getDigitoVerificador(numCuenta) != ultimoDig) {
      return false;
    }

    return true;
  }

  getDigitoVerificador(numCuenta: string): number {
    let cte: number = 2;
    let suma: number = null;
    let digit: number;
    let iResult: number;
    let iResult2: number;
    let inicio: number;

    if (numCuenta != null) {
      if (numCuenta.length == 16) {
        inicio = 0;
      } else if (numCuenta.length == 10) {
        inicio = 2;
      }

      numCuenta = numCuenta.substring(inicio, numCuenta.length - 1);

      for (let i = 0; i < numCuenta.length; i++) {
        digit = Number(numCuenta[i]);
        iResult = cte * digit;

        iResult2 = 0;
        for (let j = 0; j < iResult.toString().length; j++) {
          iResult2 += Number(iResult.toString()[j]);
        }

        suma += iResult2;

        cte = cte == 2 ? 1 : 2;

      }

      let k = 0;
      do {
        k += 10;
      } while (k <= suma)

      suma = k - suma;
      if (suma == 10) {
        suma = 0;
      }

      this.logger.log("digito verificador:" + suma);
    }

    return suma;
  }

  getImageIrregularidad(clave: number): string {
    let nombreImg: string;
    switch (clave) {
      case 4: nombreImg = "i_nula.gif";
        break;
      case 5: nombreImg = "i_poca.gif";
        break;
      case 6: nombreImg = "i_mucha.gif";
        break;
    }
    return nombreImg;
  }

  getBinBanco(numCuenta: string): number {
    if (numCuenta.length == 16) {
      let bin = Number(numCuenta.substring(0, 6));
      return bin;
    }
    return 0;
  }

  getInfoLabel(clave): Tooltip {
    let tooltip: Tooltip;
    switch (clave) {
      case "tipcon": tooltip = new Tooltip(clave, "Tipo de construcción", "descat_tipcon.html");
        break;
      case "susedi": tooltip = new Tooltip(clave, "Irregularidad en planta", "descat_susedi.html");
        break;
      case "cermar": tooltip = new Tooltip(clave, "Cercanía al mar", "descat_cermar.html");
        break;
      case "cerlago": tooltip = new Tooltip(clave, "Cercanía a lago, laguna o río", "descat_cerlago.html");
        break;
      case "cerpos": tooltip = new Tooltip(clave, "Cercanía de postes o anuncios espectaculares", "descat_cerpos.html");
        break;
      case "numpisos": tooltip = new Tooltip(clave, "Número de pisos", "descat_numpisos.html");
        break;
      case "pisos": tooltip = new Tooltip(clave, "Piso", "descat_pisos.html");
        break;
      case "cob_001": tooltip = new Tooltip(clave, "Incendio y/o Rayo", "cob_001.html");
        break;
      case "cob_002": tooltip = new Tooltip(clave, "Extensión de Cubierta", "cob_002.html");
        break;
      case "cob_003": tooltip = new Tooltip(clave, "Terremoto y/o Erupción Volcánica", "cob_003.html");
        break;
      case "cob_004": tooltip = new Tooltip(clave, "Fenómenos Hidrometeorológicos", "cob_004.html");
        break;
      case "cob_005": tooltip = new Tooltip(clave, "Fenómenos Hidro Meteorológicos (O2)", "cob_005.html");
        break;
      case "cob_006": tooltip = new Tooltip(clave, "Remoción de Escombros", "cob_006.html");
        break;
      case "cob_007": tooltip = new Tooltip(clave, "Gastos Extraordinarios", "cob_007.html");
        break;
      case "cob_008": tooltip = new Tooltip(clave, "Robo de Contenidos", "cob_008.html");
        break;
      case "cob_009": tooltip = new Tooltip(clave, "Robo de joyas y/o artículos de difícil reposición", "cob_009.html");
        break;
      case "cob_010": tooltip = new Tooltip(clave, "Dinero en efectivo", "cob_010.html");
        break;
      case "cob_011": tooltip = new Tooltip(clave, "Equipo electrodoméstico y electrónico", "cob_011.html");
        break;
      case "cob_012": tooltip = new Tooltip(clave, "Cristales", "cob_012.html");
        break;
      case "cob_013": tooltip = new Tooltip(clave, "Responsabilidad Civil", "cob_013.html");
        break;
      case "cob_013-1": tooltip = new Tooltip(clave, "Responsabilidad Civil", "cob_013-1.html");
        break;
      case "cob_013-2": tooltip = new Tooltip(clave, "Responsabilidad Civil Patronal", "cob_013-2.html");
        break;
      case "cob_013-3": tooltip = new Tooltip(clave, "Responsabilidad Civil Arrendatario", "cob_013-3.html");
        break;
      case "cob_014": tooltip = new Tooltip(clave, "Coaseguro", "cob_014.html");
        break;
      case "cob_015": tooltip = new Tooltip(clave, "Deducible", "cob_015.html");
        break;
      case "cob_016": tooltip = new Tooltip(clave, "Asistencia en el hogar", "cob_016.html");
        break;
      case "cob_017": tooltip = new Tooltip(clave, "Incendio y/o rayo", "cob_017.html");
        break;
      case "plan_1": tooltip = new Tooltip(clave, "Plan propietario", "plan_propietario.html");
        break;
      case "plan_2": tooltip = new Tooltip(clave, "Plan arrendatario", "plan_arrendatario.html");
        break;
      case "plan_3": tooltip = new Tooltip(clave, "Plan complemento hipotecario", "plan_complemento.html");
        break;
      case "plan_4": tooltip = new Tooltip(clave, "Plan arrendador", "plan_arrendador.html");
        break;
    }
    return tooltip;
  }

}

