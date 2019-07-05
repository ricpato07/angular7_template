import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HbctTeCasaHabi } from '../../models/database/HbctTeCasaHabi';
import { Logger } from '../../services/logger.service';
import { DataRestService } from '../../services/data-rest.service';
import { Opcion } from '../../models/atoms/Opcion';
import { Constants } from '../../globals/constants';
import { CheckboxItem } from '../../models/atoms/CheckboxItem';
import { MensajeError } from '../../models/atoms/MensajeError';
import { ValidacionesService } from '../../services/validaciones.service';
import { Inmueble } from '../../models/atoms/Inmueble';
import { ShareDataService } from '../../services/share-data.service';
import { ValCheckboxComponent } from '../atoms/val-checkbox/val-checkbox.component';
import { ValComboComponent } from '../atoms/val-combo/val-combo.component';
import { ValTextoComponent } from '../atoms/val-texto/val-texto.component';
import { ValorConstruccion } from '../../models/atoms/ValorConstruccion';


@Component({
  selector: 'app-datos-inmueble',
  templateUrl: './datos-inmueble.component.html'
})

export class DatosInmuebleComponent implements OnInit {
  moneda_pattern;
  integer_pattern;

  basicos: HbctTeCasaHabi;
  mensajeError: MensajeError;
  inmueble: Inmueble;
  valorConstruccion: ValorConstruccion;
  tipoViviendaCombo: Opcion[];
  descripcionViviendaCombo: Opcion[];
  situacionVivientaCombo: Opcion[];
  tipoConstruccionCombo: Opcion[];
  irregularidadPlantaCombo: Opcion[];
  cercaniaAlMarCombo: Opcion[];
  cercaniaLagoLagunaCombo: Opcion[];
  cercaniaPostesCombo: Opcion[];
  antiguedadCombo: Opcion[];
  remodeladaCombo: Opcion[];
  medidasSeguridadCheck: CheckboxItem[];
  callsLoadedlist: number[];
  medidasSeguridadSelected: string[];

  spinner_text: string;
  showModalRemodelacion: boolean;
  showModalValorInmueble: boolean;
  showModalInfo: boolean;
  bndPagaRenta: boolean;
  imgIrregularidad: string;
  cveIrregularidadSelected: string;
  textoModalInfo: string;
  numCalls: number;

  elementos: any[];

  @ViewChild('tipo_vivienda') private tipoViviendaComponent: ValComboComponent;
  @ViewChild('descripcion_vivienda') private descripcionViviendaComponent: ValComboComponent;
  @ViewChild('situacion_vivienda') private situacionViviendaComponent: ValComboComponent;
  @ViewChild('tipo_construccion') private tipoConstruccionComponent: ValComboComponent;
  @ViewChild('irregularidad_planta') private irregularidadComponent: ValComboComponent;
  @ViewChild('cercania_mar') private cercaniaMarComponent: ValComboComponent;
  @ViewChild('cercania_lago') private cercaniaLagoComponent: ValComboComponent;
  @ViewChild('cercania_postes') private cercaniaPostesComponent: ValComboComponent;
  @ViewChild('antiguedad') private antiguedadComponent: ValComboComponent;
  @ViewChild('medidas_seguridad') private medidaSeguridadComponent: ValCheckboxComponent;
  @ViewChild('remodelada') private remodeladaComponent: ValComboComponent;
  @ViewChild('valor_construccion') private valorConstruccionComponent: ValTextoComponent;
  @ViewChild('num_pisos') private numeroPisosComponent: ValTextoComponent;
  @ViewChild('num_sotanos') private pisosComponent: ValTextoComponent;

  constructor(
    private logger: Logger,
    private api: DataRestService,
    private router: Router,
    private val: ValidacionesService,
    private share: ShareDataService,
    private spinner: NgxSpinnerService
  ) {
    this.moneda_pattern = Constants.MONEDA_PATTERN;
    this.integer_pattern = Constants.INTEGER_PATTERN;
    this.mensajeError = new MensajeError();
    this.spinner_text = "Validando información ...";
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.spinner.show();
    this.callsLoadedlist = [];
    this.spinner_text = "Validando información ...";

    this.basicos = this.share.getBasicos();
    this.bndPagaRenta = this.share.getBndPagaRenta();
    this.medidasSeguridadSelected = this.share.getMedidasSeguridad();

    this.logger.log("this.share.getPerfilCliente()");
    this.logger.log(this.share.getPerfilCliente());

    //mandar llamar los combos
    this.numCalls = 10;
    this.getcomboTipoVivienda(this.basicos.cveTipovivienda);
    this.getcomboDescripcionVivienda(this.basicos.cveVivienda);
    this.getcomboSituacionVivienda(this.basicos.cveFindescan);
    this.getcomboTipoConstruccion(this.basicos.cveTipoconst);
    this.getcomboIrregularidadPlanta(this.basicos.susEdiBien);
    this.getcomboCercaniaAlMar(this.basicos.cerFteBien);
    this.getcomboCercaniaLagoLagunaRio(this.basicos.antDesBien);
    this.getcomboPostes(this.basicos.cerPosBien);
    this.getcomboAntiguedad(this.basicos.antEdiBien);
    this.getcomboRemodelada(this.basicos.bndRemBien);
    this.getcheckboxMedidasSeguridad();
    this.getLimitesConstruccionContenidos();

  }

  /** Llamadas de combos **************************** */
  getcomboTipoVivienda(value?: string) {
    this.tipoViviendaCombo = [];
    this.api.listTipoVivienda()
      .subscribe(
        result => {
          result.forEach(item => {
            this.tipoViviendaCombo.push(new Opcion(item.cveElem, item.nomElem, false));
          });
          this.tipoViviendaComponent.elementos = this.tipoViviendaCombo;
          this.basicos.cveTipovivienda = this.val.isEmpty(value) ? "004" : value;
          this.tipoViviendaComponent.setValue(this.basicos.cveTipovivienda);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Tipo de vivienda");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboDescripcionVivienda(value?: string) {
    this.descripcionViviendaCombo = [];
    this.api.listDescripcionVivienda()
      .subscribe(
        result => {
          result.forEach(item => {
            this.descripcionViviendaCombo.push(new Opcion(item.cveElem, item.desElem, false));
          });
          this.descripcionViviendaComponent.elementos = this.descripcionViviendaCombo;
          this.basicos.cveVivienda = this.val.isEmpty(value) ? '001' : value;
          this.descripcionViviendaComponent.setValue(this.basicos.cveVivienda);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Descripción de vivienda");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboSituacionVivienda(value?: string) {
    this.situacionVivientaCombo = [];
    this.api.listSituacionVivienda()
      .subscribe(
        result => {
          result.forEach(item => {
            this.situacionVivientaCombo.push(new Opcion(item.cveElem, item.desElem, false));
          });
          this.situacionViviendaComponent.elementos = this.situacionVivientaCombo;
          this.basicos.cveFindescan = this.val.isEmpty(value) ? '001' : value;
          this.situacionViviendaComponent.setValue(this.basicos.cveFindescan);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Situación de la vivienda");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboTipoConstruccion(value?: string) {
    this.tipoConstruccionCombo = [];
    this.api.listTipoConstruccion()
      .subscribe(
        result => {
          result.forEach(item => {
            this.tipoConstruccionCombo.push(new Opcion(item.cveElem, item.desElem, false));
          });
          this.tipoConstruccionComponent.elementos = this.tipoConstruccionCombo;
          this.basicos.cveTipoconst = this.val.isEmpty(value) ? 'A' : value;
          this.tipoConstruccionComponent.setValue(this.basicos.cveTipoconst);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta tipo construcccion");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboIrregularidadPlanta(value?: string) {
    this.irregularidadPlantaCombo = [];
    this.api.listIrregularidadPlanta()
      .subscribe(
        result => {
          result.forEach(item => {
            this.irregularidadPlantaCombo.push(new Opcion(item.cveElem, item.nomElem, false));
          });
          this.irregularidadComponent.elementos = this.irregularidadPlantaCombo;
          this.basicos.susEdiBien = this.val.isEmpty(value) ? '004' : value;
          this.irregularidadComponent.setValue(this.basicos.susEdiBien);
          this.cambiaImgIrregularidad(this.basicos.susEdiBien);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Irregularidad Planta");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboCercaniaAlMar(value?: string) {
    this.cercaniaAlMarCombo = [];
    this.api.listCercaniaAlMar()
      .subscribe(
        result => {
          result.forEach(item => {
            this.cercaniaAlMarCombo.push(new Opcion(item.cveElem, item.desElem, false));
          });
          this.cercaniaMarComponent.elementos = this.cercaniaAlMarCombo;
          this.basicos.cerFteBien = this.val.isEmpty(value) ? '004' : value;
          this.cercaniaMarComponent.setValue(this.basicos.cerFteBien);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta cercania al mar");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboCercaniaLagoLagunaRio(value?: string) {
    this.cercaniaLagoLagunaCombo = [];
    this.api.listCercaniaLagoLagunaRio()
      .subscribe(
        result => {
          result.forEach(item => {
            this.cercaniaLagoLagunaCombo.push(new Opcion(item.cveElem, item.desElem, false));
          });
          this.cercaniaLagoComponent.elementos = this.cercaniaLagoLagunaCombo;
          this.basicos.antDesBien = this.val.isEmpty(value) ? '004' : value;
          this.cercaniaLagoComponent.setValue(this.basicos.antDesBien);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta cercania a lago, laguna, río");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboPostes(value?: string) {
    this.cercaniaPostesCombo = [];
    this.api.listCercaniaPostes()
      .subscribe(
        result => {
          result.forEach(item => {
            this.cercaniaPostesCombo.push(new Opcion(item.cveElem, item.desElem, false));
          });
          this.cercaniaPostesComponent.elementos = this.cercaniaPostesCombo;
          this.basicos.cerPosBien = this.val.isEmpty(value) ? '001' : value;
          this.cercaniaPostesComponent.setValue(this.basicos.cerPosBien);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta cercania postes");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboAntiguedad(value?: string) {
    this.antiguedadCombo = [];
    this.api.listAntiguedad()
      .subscribe(
        result => {
          result.forEach(item => {
            this.antiguedadCombo.push(new Opcion(item.cveElem, item.nomElem, false));
          });
          this.antiguedadComponent.elementos = this.antiguedadCombo;
          this.basicos.antEdiBien = this.val.isEmpty(value) ? '001' : value;
          this.antiguedadComponent.setValue(this.basicos.antEdiBien);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta antigüedad del inmueble");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboRemodelada(value?: number) {

    this.remodeladaCombo = [];
    this.api.listSiNoOpcion()
      .subscribe(
        result => {
          this.remodeladaCombo = result;
          this.remodeladaComponent.elementos = this.remodeladaCombo;
          this.basicos.bndRemBien = this.val.isEmpty(value) ? 0 : value;
          this.remodeladaComponent.setValue(this.basicos.bndRemBien);
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Remodelada");
          this.logger.error(<any>error);
        }
      )
  }

  getcheckboxMedidasSeguridad() {
    this.medidasSeguridadCheck = [];
    this.api.listMedidasSeguridad()
      .subscribe(
        result => {
          result = result.sort((a, b) => Number(a.cveElem) - Number(b.cveElem));

          result.forEach(item => {
            let bselected = false;
            if (!this.val.isEmpty(this.medidasSeguridadSelected)) {
              for (let selected of this.medidasSeguridadSelected) {
                if (item.cveElem == selected) {
                  bselected = true;
                  break;
                }
              }
            }
            this.medidasSeguridadCheck.push(new CheckboxItem(item.cveElem, item.nomElem, bselected));
            this.medidasSelected(this.medidasSeguridadSelected);
          });
          this.medidaSeguridadComponent.options = this.medidasSeguridadCheck;
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta medidas de seguridad");
          this.logger.error(<any>error);
        }
      )
  }


  allCallsLoaded(complete) {
    this.callsLoadedlist.push(complete);
    let suma = 0;
    for (let i = 0; i < this.callsLoadedlist.length; i++) {
      suma += this.callsLoadedlist[i];
    }
    if (suma == this.numCalls) {
      this.spinner.hide();
    }
  }


  /********************************************** */

  /** Combo Irregularidad **************************** */

  irregularidadChange(event: string) {
    this.basicos.susEdiBien = event;
    this.cambiaImgIrregularidad(event);
  }

  cambiaImgIrregularidad(cveIrregularidad: string) {
    this.imgIrregularidad = Constants.IMG_PATH
      + this.val.getImageIrregularidad(Number(cveIrregularidad));
  }

  /********************************************** */

  /** Checkbox medidas de seguridad *************** */

  medidasSelected(array) {

    this.logger.log("medidasSelected");
    this.logger.log(array);

    this.share.setMedidasSeguridad(array);

    this.basicos.cveSisSeg1 = 0;
    this.basicos.cveSisSeg2 = 0;
    this.basicos.cveSisSeg3 = null;
    this.basicos.cveSisSeg4 = null;
    this.basicos.cveSisSeg5 = null;

    if (array != null) {
      array.forEach(item => {
        let cveSis = Number(item);
        switch (cveSis) {
          case 1: this.basicos.cveSisSeg1 = cveSis;
            break;
          case 2: this.basicos.cveSisSeg2 = cveSis;
            break;
          case 3: this.basicos.cveSisSeg3 = cveSis;
            break;
          case 4: this.basicos.cveSisSeg4 = cveSis;
            break;
          case 5: this.basicos.cveSisSeg5 = cveSis;
            break;
        }
      })
    }
  }

  /********************************************** */

  /** Modal remodelacion **************************** */

  mostrarModalRemodelacion() {
    this.spinner_text = "Cargando información ...";
    this.showModalRemodelacion = true;
  }

  addTipoRemodelacion() {
    this.logger.log("addTipoRemodelacion");
    let tiposRemodelacionlist = this.share.getTiposRemodelacion();
    this.logger.log(tiposRemodelacionlist);
    this.showModalRemodelacion = false;
    //ejemplo 0|1|0|0|0| 
    let cadena = "";
    for (let i = 1; i < 6; i++) {
      let found = false;
      if (tiposRemodelacionlist != null) {
        for (let item of tiposRemodelacionlist) {
          if (Number(item) == i) {
            found = true;
            break;
          }
        }
      }
      if (found) {
        cadena += "1|";
      } else {
        cadena += "0|";
      }
    }

    this.basicos.tpoRemBien = cadena;
  }

  /********************************************** */

  /** Modal del inmueble **************************** */

  mostrarModalValorInmueble() {
    this.spinner_text = "Cargando información ...";
    this.showModalValorInmueble = true;
  }

  addValorInmueble(event: boolean) {
    this.showModalValorInmueble = false;
    if (event) {
      this.inmueble = this.share.getInmuebleModal();
      this.basicos.valorEdificio = this.inmueble.valorInmueble;
    }
  }

  /********************************************** */

  /** Modal información **************************** */

  mostrarModalInformacion(opcion) {
    this.spinner_text = "Cargando información ...";
    this.textoModalInfo = "";
    this.showModalInfo = true;
  }

  cerrarModalInformacion(event: boolean) {
    this.showModalInfo = false;
  }

  /********************************************** */


  /** Valida valor construcción y contenidos  *** */

  getLimitesConstruccionContenidos() {

    if (!this.bndPagaRenta) {
      this.api.validaLimiteConstruccion()
        .subscribe(
          result => {
            this.valorConstruccion = result;
          },
          error => {
            this.logger.error("Error en consulta limite construcción");
            this.logger.error(<any>error);
          }
        )
    } else {
      this.api.validaLimiteContenido()
        .subscribe(
          result => {
            this.valorConstruccion = result;
          },
          error => {
            this.logger.error("Error en consulta limite contenido");
            this.logger.error(<any>error);
          }
        )
    }
  }

  validaConstruccionContenidos(value): boolean {
    this.basicos.valorEdificio = value;

    if (this.val.isEmpty(value)) {
      return false;
    }

    if (!this.bndPagaRenta) {
      if (this.basicos.valorEdificio < this.valorConstruccion.minimo) {
        this.valorConstruccionComponent.showError("No se cumple con el límite mínimo de construcción");
        return false;
      } else if (this.basicos.valorEdificio > this.valorConstruccion.maximo) {
        this.valorConstruccionComponent.showError("Se excede el límite máximo de construcción");
        return false;
      }
    } else {
      if (this.basicos.valorEdificio < this.valorConstruccion.minimo) {
        this.valorConstruccionComponent.showError("No se cumple con el límite mínimo de contenido");
        return false;
      } else if (this.basicos.valorEdificio > this.valorConstruccion.maximo) {
        this.valorConstruccionComponent.showError("Se excede el límite máximo de contenido");
        return false;
      }
    }
    return true;
  }

  /** Valida form  **************************** */

  validaPisos(): boolean {
    if (this.basicos.numPisosinm <= 0) {
      this.numeroPisosComponent.showError("El número de pisos tiene que ser mayor a 0");
      return false;
    }
    if (this.basicos.numSotanosinm <= 0) {
      this.pisosComponent.showError("El piso tiene que ser mayor a 0");
      return false;
    }
    if (this.basicos.numSotanosinm > this.basicos.numPisosinm) {
      this.pisosComponent.showError("El piso tiene que ser menor o igual al número de pisos colocados");
      return false;
    }
    return true;
  }

  validaForm(): boolean {
    let bndRes: boolean = true;

    if (!this.tipoViviendaComponent.valida()) {
      bndRes = false;
    }
    if (!this.descripcionViviendaComponent.valida()) {
      bndRes = false;
    }
    if (!this.situacionViviendaComponent.valida()) {
      bndRes = false;
    }
    if (!this.tipoConstruccionComponent.valida()) {
      bndRes = false;
    }
    if (!this.numeroPisosComponent.valida()) {
      bndRes = false;
    }
    if (!this.pisosComponent.valida()) {
      bndRes = false;
    }
    if (!this.validaPisos()) {
      bndRes = false;
    }
    if (!this.irregularidadComponent.valida()) {
      bndRes = false;
    }
    if (!this.cercaniaMarComponent.valida()) {
      bndRes = false;
    }
    if (!this.cercaniaLagoComponent.valida()) {
      bndRes = false;
    }
    if (!this.cercaniaPostesComponent.valida()) {
      bndRes = false;
    }
    if (!this.antiguedadComponent.valida()) {
      bndRes = false;
    }
    if (!this.remodeladaComponent.valida()) {
      bndRes = false;
    }
    if (!this.valorConstruccionComponent.valida()) {
      bndRes = false;
    }
    if (!this.validaConstruccionContenidos(this.basicos.valorEdificio)) {
      bndRes = false;
    }

    return bndRes;
  }

  /********************************************** */

  /** Mostrar errores **************************** */
  showError(error) {
    this.mensajeError = new MensajeError("Error formulario:",
      error,
      true
    );
  }

  /********************************************** */

  /** Botones **************************** */
  regresar() {
    this.share.setBack(true);
    this.router.navigate(['/basicos-contratante']);
  }

  continuar() {
    this.logger.log("continuar");
    this.spinner.show();
    this.spinner_text = "Validando información ...";
    if (this.validaForm()) {
      this.guardarInformacion();
    } else {
      this.showError("Existen campos incorrectos en el formulario, debes corregirlos para continuar");
      this.spinner.hide();
    }
  }

  guardarInformacion() {
    setTimeout(() => {
      this.addTipoRemodelacion();
      this.share.setBasicos(this.basicos);
      this.spinner.hide();
      this.router.navigate(['cotizacion']);
    }, 1000);
  }

  /********************************************** */
}
