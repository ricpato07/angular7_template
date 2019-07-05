import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from '../../services/logger.service';
import { DataRestService } from '../../services/data-rest.service';
import { ValidacionesService } from '../../services/validaciones.service';
import { ShareDataService } from '../../services/share-data.service';
import { MensajeError } from '../../models/atoms/MensajeError';
import { HbctTeCasaHabi } from '../../models/database/HbctTeCasaHabi';
import { CodigoPostal } from '../../models/atoms/CodigoPostal';
import { Opcion } from '../../models/atoms/Opcion';
import { FormaPagoComponent } from '../atoms/forma-pago/forma-pago.component';
import { TcCatalog } from '../../models/database/TcCatalog';
import { Coberturas } from '../../models/atoms/Coberturas';
import { ValComboComponent } from '../atoms/val-combo/val-combo.component';
import { FormasPago } from '../../models/atoms/FormasPago';
import { PagosPlanes } from '../../models/atoms/PagosPlanes';
import { CheckboxItem } from '../../models/atoms/CheckboxItem';
import { Tooltip } from '../../models/atoms/Tooltip';
import { ValidacionResponse } from '../../models/atoms/ValidacionResponse';
import { DatosEjecutivo } from '../../models/atoms/DatosEjecutivo';
import { PerfilCliente } from '../../models/atoms/PerfilCliente';
import { Cuentas } from '../../models/atoms/Cuentas';
import { TcMoneda } from '../../models/database/TcMoneda';
import { HbctTcOpcApp } from '../../models/database/HbctTcOpcApp';
import { BpsTcOpcion } from '../../models/database/BpsTcOpcion';
import { Promociones } from '../../models/atoms/Promociones';
import { CotizacionParams } from '../../models/atoms/CotizacionParams';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html'
})
export class CotizacionComponent implements OnInit {
  mensajeError: MensajeError;
  spinner_text: string;
  basicos: HbctTeCasaHabi;
  codigoPostal: CodigoPostal;
  perfilCliente: PerfilCliente;
  tooltip: Tooltip;
  datosEjecutivo: DatosEjecutivo;
  cuentasAlternativas: Cuentas;
  moneda: TcMoneda;
  showModalInfo = false;
  showModalPdf = false;
  showRecarcular = false;
  showVenta: boolean;
  coberturaslist: Coberturas[];
  formasPagolist: FormasPago[];
  planeslist: TcCatalog[];
  coberturasOpcionaleslist: Coberturas[];
  bndPagaRenta: boolean;
  avisoPrivacidad: number;
  numCalls: number;
  callsLoadedlist: number[];
  opcionesFormaPago: Opcion[];
  pagosSubsecuentes: number;
  planesRadio: Opcion[];
  pagosPlaneslist: any;
  avisoPrivacidadCombo: Opcion[];
  bndShowCoberturas: boolean;
  bndDescuento: boolean;
  descuento: HbctTcOpcApp;
  urlPdf : string;


  @ViewChild('forma_pago') private formaPagoComponent: FormaPagoComponent;
  @ViewChild('aviso_privacidad') private avisoPrivacidadComponent: ValComboComponent;

  constructor(
    private logger: Logger,
    private api: DataRestService,
    private router: Router,
    private val: ValidacionesService,
    private share: ShareDataService,
    private spinner: NgxSpinnerService
  ) {
    this.mensajeError = new MensajeError();
    this.spinner_text = "Cargando información...";
    this.bndShowCoberturas = false;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.callsLoadedlist = [];
    this.spinner.show();
    this.spinner_text = "Cargando información...";

    this.tooltip = new Tooltip(null, null, null);
    this.bndPagaRenta = this.share.getBndPagaRenta();
    this.basicos = this.share.getBasicos();
    this.codigoPostal = this.share.getCodigoPostal();
    this.datosEjecutivo = this.share.getDatosEjecutivo();
    this.perfilCliente = this.share.getPerfilCliente();
    this.cuentasAlternativas = this.share.getCuentasAlternativas();
    this.moneda = this.share.getMoneda();

    this.numCalls = 7;
    this.validaTipoUsuario(this.datosEjecutivo.typeusr);
    this.getRadioFormasPago(this.basicos.desTemporalidad);
    //realiza tambien la llamada de getCoberturasOpcionales y getPagosPlanes
    this.getPlanes(this.basicos.bndPropietario);
    this.getCoberturas();
    this.getIdUsuarioVenta();
    this.getDescuentos();
    //no realiza petición
    this.getcomboAvisoPrivacidad();

    this.logger.log(this.val.getBrowser());
  }

  /** Cargar datos página  **************************** */


  validaTipoUsuario(tipoUser: string) {

    this.api.validaTipoUsuario(tipoUser)
      .subscribe(
        (result: ValidacionResponse) => {
          this.logger.log("validaTipoUsuario");
          this.logger.log(result);
          this.showVenta = result.ventaValida;
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Valida tipo usuario");
          this.logger.error(<any>error);
        }
      )
  }

  getRadioFormasPago(value?: string) {
    this.opcionesFormaPago = [];
    let valueSelected = this.val.isEmpty(value) ? "ANUAL" : value;
    this.api.listFormasPago()
      .subscribe(
        (result: FormasPago[]) => {
          this.logger.log("getRadioFormasPago");
          //this.logger.log(result);

          this.formasPagolist = result.sort((a, b) => b.cveFormaPago - a.cveFormaPago);

          this.formasPagolist.forEach(item => {
            let selected = false;
            if (item.desFormaPago == valueSelected) {
              selected = true;
            }
            this.opcionesFormaPago.push(new Opcion(item.desFormaPago, item.desFormaPago, selected));
          });
          this.formaPagoComponent.opciones = this.opcionesFormaPago;
          this.formaPagoChange(valueSelected);

          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta forma de pago");
          this.logger.error(<any>error);
        }
      )
  }

  getPlanes(value?: string) {

    this.planesRadio = [];

    if (!this.bndPagaRenta) {
      value = this.val.isEmpty(value) ? "1" : value;
    } else {
      value = this.val.isEmpty(value) ? "2" : value;
    }
    this.basicos.bndPropietario = value;

    this.api.listTipoPlanes()
     .subscribe(
        (result: TcCatalog[]) => {
          this.logger.log(result);

          if (!this.bndPagaRenta) {
            this.planeslist = result.filter(result => result.valElem != 2);
          } else {
            this.planeslist = result.filter(result => result.valElem == 2);
          }
          this.logger.log("getPlanes");
          this.logger.log(this.planeslist);

          for (let res of this.planeslist) {
            let bndSelected = false;
            if (res.valElem == Number(value)) {
              bndSelected = true;
            }
            this.planesRadio.push(new Opcion(res.valElem.toString(), res.nomElem, bndSelected));
          }
          this.allCallsLoaded(1);
          this.getCoberturasOpcionales();
        },
        error => {
          this.logger.error("Error en consulta listTipoPlanes");
          this.logger.error(<any>error);
        }
      )
  }

  getCoberturasOpcionales() {
    this.api.listCoberturasOpcionales()
      .subscribe(
        (result: Coberturas[]) => {
          this.logger.log("getCoberturasOpcionales");
          this.logger.log(result);
          result.map(res => {
            res.selected = true;
          })
          this.coberturasOpcionaleslist = result;
          this.allCallsLoaded(1);
          this.getPagosPlanes(this.basicos.bndPropietario);
        },
        error => {
          this.logger.error("Error en consulta Coberturas opcionales");
          this.logger.error(<any>error);
        });
  }

  getPagosPlanes(value?: string) {
    let params: CotizacionParams = {};
    let coberturaOpcional : any;
    let coberturaslist : Number[];
    let opcSeleccionadas = {};
    params.hbctTeCasahabi = this.basicos;
    params.coberturasOpcSeleccionadas  = {};
    this.logger.log("getPagosPlanes");

    this.planeslist.map(plan => {
       coberturaOpcional = {};
       coberturaslist = [];

      this.coberturasOpcionaleslist.map(cob => {
        if (plan.valElem == Number(cob.nomElem)) {
          coberturaslist.push(cob.valElem);
        }
      })
      coberturaOpcional[plan.valElem] = coberturaslist;
      opcSeleccionadas = Object.assign(opcSeleccionadas,coberturaOpcional);      
    })
    params.coberturasOpcSeleccionadas  = opcSeleccionadas;

    this.showPagosPlanes(params, value);

  }

  showPagosPlanes(params: CotizacionParams, value?: string) {
    this.showRecarcular = true;
    this.logger.log("params cotización");
    this.logger.log(params);

    this.api.listPagosPlanes(params)
      .subscribe(
        (planes: PagosPlanes[]) => {
          this.pagosPlaneslist = planes;
          if (!this.bndPagaRenta) {
            this.pagosPlaneslist
              .map(result => {
                result.elementos = result.elementos.filter(elem => elem.cvePlan != 2);
              })
          } else {
            this.pagosPlaneslist
              .map(result => {
                result.elementos = result.elementos.filter(elem => elem.cvePlan == 2);
              })
          }

          this.pagosPlaneslist
            .map(result => {
              switch (result.cvePago) {
                case "primer_pago":
                  result.elementos
                    .map(elem => {
                      if (elem.cvePlan == value) {
                        this.basicos.impPrimerPago = elem.monto;
                        this.basicos.primaSegunTemp = this.basicos.impPrimerPago;
                      }
                    })
                  break;
                case "pago_subs":
                  result.elementos
                    .map(elem => {
                      if (elem.cvePlan == value) {
                        this.basicos.impPagoSubs = elem.monto;
                      }
                    })
                  break;
                case "prima_total":
                  result.elementos
                    .map(elem => {
                      if (elem.cvePlan == value) {
                        this.basicos.primaTotalAnual = elem.monto;
                      }
                    })
                  break;
                case "prima_neta":
                  result.elementos
                    .map(elem => {
                      if (elem.cvePlan == value) {
                        this.basicos.primaNeta = elem.monto;
                      }
                    })
                  break;
              }
            })
          this.allCallsLoaded(1);
          this.showRecarcular = false;
        },
        error => {
          this.logger.error("Error en consulta Pagos planes");
          this.logger.error(<any>error);
        }
      )
  }

  getCoberturas() {

    this.api.listTablaCoberturas()
      .subscribe(
        (result: Coberturas[]) => {
          this.logger.log("getCoberturas");
          this.logger.log(result);
          this.coberturaslist = result;
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta coberturas");
          this.logger.error(<any>error);
        }
      )
  }

  getcomboAvisoPrivacidad() {

    this.api.listSiNoOpcion()
      .subscribe(
        (result: Opcion[]) => {
          this.avisoPrivacidadCombo = result;
          this.avisoPrivacidadCombo.unshift(new Opcion("", "", false));
          this.avisoPrivacidadComponent.elementos = this.avisoPrivacidadCombo;
        },
        error => {
          this.logger.error("Error en consulta Remodelada");
          this.logger.error(<any>error);
        }
      )
  }

  getDescuentos() {
    this.bndDescuento = false;
    let params: Promociones = {};
    params.numCuenta = this.basicos.numCuenta;
    params.cveTipoCliente = this.perfilCliente.perfilCliente;
    params.tipoPago = this.cuentasAlternativas.tipoPago;
    this.api.getDescuento(params)
      .subscribe(
        (result: HbctTcOpcApp) => {
          this.bndDescuento = true;
          this.descuento = result;
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta Descuento");
          this.logger.error(<any>error);
        }
      )
  }

  getIdUsuarioVenta() {

    this.api.getIdUsuarioVenta(this.basicos.numCuenta)
      .subscribe(
        (result: BpsTcOpcion) => {
          this.basicos.idUsrVta = result.desOpcion;
          this.allCallsLoaded(1);
        },
        error => {
          this.logger.error("Error en consulta IdUsuarioVenta");
          this.logger.error(<any>error);
        }
      )
  }

  /** Acciones componentes *********************** */

  formaPagoChange(value: string) {
    this.logger.log("formaPagoChange");
    this.logger.log(value);
    this.basicos.desTemporalidad = value;

    this.pagosSubsecuentes = this.formasPagolist
      .filter(result => result.desFormaPago == value)
      .reduce((total, pago) => pago.numPeriodos - 1, 0);
  }

  planChange(value) {
    this.logger.log("planChange");
    this.logger.log(value);
    this.basicos.bndPropietario = value;
  }

  coberturaOpcionalChange(checkboxItem: CheckboxItem, cvePlan: number) {
    this.logger.log("coberturaOpcionalChange");
    this.logger.log(checkboxItem);
    this.logger.log(cvePlan);

    let params: CotizacionParams = {};
    let coberturaOpcional: {};
    let coberturaslist = [];
    let opcSeleccionadas = {};
    params.hbctTeCasahabi = this.basicos;
    params.coberturasOpcSeleccionadas  = [];

    this.coberturasOpcionaleslist
      .filter(result => Number(result.nomElem) == cvePlan)
      .map(result => {
        if (result.valElem == Number(checkboxItem.value)) {
          result.selected = checkboxItem.checked;
        }
      }
      )

    this.planeslist.map(plan => {
        coberturaOpcional = {};
        coberturaslist = [];

        this.coberturasOpcionaleslist.map(cob => {
          if (plan.valElem == Number(cob.nomElem) && cob.selected) {
            coberturaslist.push(cob.valElem);
          }
        })
        coberturaOpcional[plan.valElem] = coberturaslist;
        opcSeleccionadas = Object.assign(opcSeleccionadas,coberturaOpcional);      
    })
    params.coberturasOpcSeleccionadas  = opcSeleccionadas;

    this.showPagosPlanes(params, cvePlan.toString());
  }

  /* Show info modal  ******************************/

  showInfo(cveInfo) {
    this.logger.log("showInfo");
    this.logger.log(cveInfo);
    this.tooltip = this.val.getInfoLabel(cveInfo);
    this.logger.log(this.tooltip);

    this.api.getHtml(this.tooltip.path)
      .subscribe(
        result => {
          this.tooltip.html = result;
        },
        error => {
          this.logger.error("Error en consulta al HTML");
          this.logger.error(<any>error);
        }
      );
    this.showModalInfo = true;
  }

  cerrarModalTooltip(event: boolean) {
    this.showModalInfo = event;
  }

  cerrarModalPdf(event: boolean) {
    this.showModalPdf = event;
  }

  /** Valida form  **************************** */

  validaAvisoPrivacidad(): boolean {
    if (this.avisoPrivacidad != 1) {
      this.showError("Para continuar debe reconocer el aviso de privacidad de HSBC Seguros");
      return false;
    }
    return true;
  }

  validaForm(): boolean {

    if(this.val.isEmpty(this.basicos.bndPropietario)){
      this.showError("Es necesario seleccionar un plan");
      return false;
    }
    if(this.val.isEmpty(this.basicos.desTemporalidad)){
      this.showError("Es necesario seleccionar la forma de pago");
      return false;
    }
    if (!this.validaAvisoPrivacidad()) {
      return false;
    }
    return true;
  }

  allCallsLoaded(complete) {
    this.callsLoadedlist.push(complete);
    let suma = 0;
    for (let i = 0; i < this.callsLoadedlist.length; i++) {
      suma += this.callsLoadedlist[i];
    }
    // this.logger.log("allCallsLoaded");
    // this.logger.log("suma: " + suma);
    // this.logger.log("numCalls: " + this.numCalls);
    if (suma == this.numCalls) {
      this.spinner.hide();
    }
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

  clickCoberturas() {
    this.bndShowCoberturas = !this.bndShowCoberturas;
  }

  regresar() {
    this.share.setBack(true);
    this.router.navigate(['/datos-inmueble']);
  }

  imprimirCotizacion() {
    this.logger.log("imprimirCotizacion");
    if (this.validaAvisoPrivacidad()) {
      //this.urlPdf = "assets/html/download.pdf";
      this.basicos.numCotiza = 901297;
      this.showModalPdf = true;
    }
  }

  otraCotizacion() {
    this.share.setBack(false);
    this.router.navigate(['/basicos-contratante']);
  }

  ventaSeguro() {
    this.logger.log("ventaSeguro");
    if (this.validaForm()) {
      this.spinner_text = "Validando información ...";
      this.guardarInformacion(true);
    } else {
      this.spinner.hide();
    }
  }

  generarCotizacion(bndVenta: boolean){
    this.guardarInformacion(bndVenta);
  }

  guardarInformacion(bndVenta: boolean) {
    this.basicos.idDocum = "C"; //tipo de documento Cotización
    this.basicos.impCambio = this.moneda.impCambio;
    this.basicos.bndEditaCot = 0;
    this.basicos.bndCobrado = 0;
    this.basicos.bndExpSaldo = 0;
    this.basicos.typeUsr = this.datosEjecutivo.typeusr;
    this.basicos.idOrigen = "W";
    this.basicos.bndVenta = "L";
    this.basicos.bndStatus = "C";
    this.basicos.numSucursal = this.datosEjecutivo.suc;
    this.basicos.numEjecutivo = this.datosEjecutivo.usr.toString();
    this.basicos.numPromotor = this.datosEjecutivo.prom;
    this.basicos.cveTipCli = this.perfilCliente.perfilCliente;

    //datos del contratante
    this.basicos.desDomCont = this.basicos.desDomicilio;
    this.basicos.desColCont = this.basicos.desColonia;
    this.basicos.numExtCont = this.basicos.numExt;
    this.basicos.numIntCont = this.basicos.numInt;
    this.basicos.codPostalCont = this.basicos.codPostal;
    this.basicos.cveEstadoCont = this.basicos.cveEstado;
    this.basicos.cveCiudadCont = this.basicos.cveCiudad;
    this.basicos.desDomBien = this.basicos.desDomicilio;
    this.basicos.desColBien = this.basicos.desColonia;
    this.basicos.numExtBien = this.basicos.numExt;
    this.basicos.numIntBien = this.basicos.numInt;
    this.basicos.codPostalBien = this.basicos.codPostal;
    this.basicos.cveEstadoBien = this.basicos.cveEstado;
    this.basicos.cveCiudadBien = this.basicos.cveCiudad;

    //Formas de pago
    this.basicos.cveConductoCobro = this.cuentasAlternativas.tipoPago.toString();
    if (this.val.isEmpty(this.basicos.numCuenta2)) {
      this.basicos.conductoCobro2 = this.cuentasAlternativas.tipoPago2.toString();
    }
    if (this.val.isEmpty(this.basicos.numCuenta3)) {
      this.basicos.conductoCobro3 = this.cuentasAlternativas.tipoPago3.toString();
    }

    //valores que se agregan en la venta
    this.basicos.cveCis = null;
    this.basicos.cveCisCont = null;
    if (bndVenta) {
      this.basicos.cveCis = this.perfilCliente.numeroCliente;
      this.basicos.cveCisCont = this.perfilCliente.numeroCliente;
    }

    //si el contratante == asegurado, coloca el nombre y el apellido
    if (this.basicos.bndContAseg == 1) {
      this.basicos.nomAsegurado = this.basicos.nomContratante;
      this.basicos.apeAsegurado = this.basicos.apeContratante;
    }

    this.basicos.cveTipomuros = null;
    this.basicos.cveTipotechos = null;
    this.basicos.nivInuBien = null;
    this.basicos.cvePersonaCont = null;
    this.basicos.cvePersonaAseg = null;
    this.basicos.cveSexo = null;
    this.basicos.cveRfc = null;
    this.basicos.numTelefono = null;
    this.basicos.empTel = null;
    this.basicos.cveSexoCont = null;
    this.basicos.cveRfcCont = null;
    this.basicos.numTelCont = null;
    this.basicos.empTelCont = null;
    this.basicos.datDedSele = null;
    this.basicos.usrAutorizaExp = null;
    this.basicos.numEjecRef = null;
    this.basicos.numPromRef = null;
    this.basicos.mailEjecutivo = null;
    this.basicos.cveAgente = null;

    setTimeout(() => {
      this.share.setBasicos(this.basicos);
      this.spinner.hide();
      //this.router.navigate(['cotizacion']);
    }, 1000);
  }

  /********************************************** */
}
