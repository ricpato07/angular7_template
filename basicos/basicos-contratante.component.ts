import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { HbctTcCasaHabi } from '../../models/database/HbctTcCasaHabi';
import { Opcion } from '../../models/atoms/Opcion';
import { Logger } from '../../services/logger.service';
import { StorageService } from '../../services/storage.service';
import { Cuentas } from '../../models/atoms/Cuentas';
import { ModalCuentasComponent } from '../atoms/modal-cuentas/modal-cuentas.component';
import { Constants } from '../../globals/constants';
import { CodigoPostal } from '../../models/atoms/CodigoPostal';
import { ValidacionesService } from '../../services/validaciones.service';
import { ValTextoComponent } from '../atoms/val-texto/val-texto.component';
import { MensajeError } from '../../models/atoms/MensajeError';
import { ValRadioComponent } from '../atoms/val-radio/val-radio.component';
import { DataRestService } from '../../services/data-rest.service';
import { TcProductos } from '../../models/database/TcProductos';
import { TcMoneda } from '../../models/database/TcMoneda';
import { Domicilio } from '../../models/atoms/Domicilio';
import { ValNumeroCuentaComponent } from '../atoms/val-numero-cuenta/val-numero-cuenta.component';
import { ShareDataService } from '../../services/share-data.service';
import { MensajeErrorComponent } from '../atoms/mensaje-error/mensaje-error.component';


@Component({
  selector: 'app-basicos-contratante',
  templateUrl: './basicos-contratante.component.html'
})
export class BasicosContratanteComponent implements OnInit {
  name_pattern;
  num_casa_pattern;
  integer_pattern;

  basicos: HbctTcCasaHabi;
  codigoPostal: CodigoPostal;
  domicilio: Domicilio;
  cuentasAlternativas: Cuentas;
  productoActual: TcProductos;
  mensajeError: MensajeError;

  showModal: boolean;
  bndPagaRenta: number;
  spinner_text: string;
  errorAcceso: string;
  bndErrorAcceso: boolean;
  txtErrorFormulario: string;
  bndCuentaValida: boolean;
  opcionesTitular: Opcion[];
  opcionesPagaRenta: Opcion[];

  @ViewChild('modal_cuentas') private modalCuentasComponent: ModalCuentasComponent;
  @ViewChild('nom_contratante') private nomContratanteComponent: ValTextoComponent;
  @ViewChild('ape_contratante') private apeContratanteComponent: ValTextoComponent;
  @ViewChild('num_cuenta') private numCuentaComponent: ValNumeroCuentaComponent;
  @ViewChild('titular_asegurado') private titularAseguradoComponent: ValRadioComponent;
  @ViewChild('des_domicilio') private desDomicilioComponent: ValTextoComponent;
  @ViewChild('num_ext') private numExtComponent: ValTextoComponent;
  @ViewChild('bnd_paga_renta') private bndPagaRentaComponent: ValRadioComponent;
  @ViewChild('mensaje_error') private mensajeErrorComponent: MensajeErrorComponent;


  constructor(
    private logger: Logger,
    private storage: StorageService,
    private router: Router,
    private val: ValidacionesService,
    private spinner: NgxSpinnerService,
    private api: DataRestService,
    private share: ShareDataService
  ) {
    this.name_pattern = Constants.NOMBRE_PATTERN;
    this.integer_pattern = Constants.INTEGER_PATTERN;
    this.num_casa_pattern = Constants.NUM_CASA_PATTERN;

    this.mensajeError = new MensajeError();
    this.spinner_text = "Validando información ...";
  }


  ngOnInit() {
    this.logger.log("(ngOnInit) BasicosContratanteComponent");
    window.scrollTo(0, 0);
    let back: boolean = this.storage.getItem("Back");
    this.opcionesTitular = this.api.listSiNoOpcion("1");
    this.opcionesPagaRenta = this.api.listSiNoOpcion("0");

    if (back) {
      this.bndCuentaValida = true;
      this.basicos = this.storage.getItem("basicos");
      this.codigoPostal = this.storage.getItem("codigoPostal");
      this.cuentasAlternativas = this.storage.getItem("cuentasAlternativas") == null ? {} : this.storage.getItem("cuentasAlternativas");
      this.storage.cleanItem("Back");
    } else {
      this.basicos = {};
      this.bndPagaRenta = 0;
      this.bndCuentaValida = false;
      this.codigoPostal = {};
      this.cuentasAlternativas = {};
      this.storage.clearAll();
      this.mensajeErrorComponent.ocultar();
      this.validacionesPrevias();
    }
  }

  /*** Cuenta *******************************************/

  cuentaAction(bndcuentaValida: boolean) {

    if (bndcuentaValida) {
      this.spinner_text = "Obteniendo información ...";
      this.spinner.show();

      this.validarDigitoVerificador(this.basicos.numCuenta)
        .pipe(
          map(
            resCuenta => {
              if (!resCuenta) {
                this.numCuentaComponent.showError("Error en el dígito verificador de la cuenta principal");
                this.spinner.hide();
                throw new Error('Error en el dígito verificador de la cuenta principal');
              }
              else {
                if (this.val.getTipoPagoCuenta(this.basicos.numCuenta) == 1) {
                  this.validarBinCuenta(this.basicos.numCuenta)
                    .subscribe(
                      result => {
                        if (!result.status) {
                          this.showError("Error en el bin de la cuenta principal");
                          this.numCuentaComponent.showError("Error en el bin de la cuenta principal");
                          this.spinner.hide();
                          throw new Error('Error en el bin de la cuenta principal');
                        } else {
                          return result;
                        }
                      },
                      error => {
                        this.spinner.hide();
                        throw new Error('Error en consulta bin cuenta principal');
                      }
                    )
                } else {
                  return resCuenta;
                }
              }
            }
          ), catchError(error => {
            this.spinner.hide();
            throw new Error(<any>error);
          })
        )
        .subscribe((result) => {
          this.getPerfilCliente();
        }
        )
    }
  }

  getPerfilCliente() {
    this.api.getPerfilCliente(this.basicos.numCuenta)
      .subscribe(
        result => {
          this.logger.log("getPerfilCliente");
          this.logger.log(result);
          this.share.setPerfilCliente(result);
          this.basicos.nomContratante = result.nombre;
          this.basicos.apeContratante = result.apellidos;
          this.bndCuentaValida = true;
          this.spinner.hide();
          this.mensajeErrorComponent.ocultar();
        },
        error => {
          this.logger.error("Error en consulta al Perfil del cliente");
          this.logger.error(<any>error);
          this.showErrorCore("Error de conexión: ", "Error en consulta al Perfil del cliente");
          this.spinner.hide();
        }
      );
  }

  mostrarModal() {
    this.showModal = true;
    this.modalCuentasComponent.loadCuentasShare();
  }

  addCuentasAlternativas(event: boolean) {
    this.logger.log("addCuentasAlternativas");
    this.showModal = false;
    this.cuentasAlternativas = this.storage.getItem("cuentasAlternativas");
    if (this.cuentasAlternativas != null) {
      this.basicos.numCuenta2 = this.cuentasAlternativas.numCuenta2;
      this.basicos.numCuenta3 = this.cuentasAlternativas.numCuenta3;
    }
  }

  /**********************************************************/

  /*** Código Postal *******************************************/

  codigoPostalResponse(codigoPostal) {
    this.logger.log("codigoPostalResponse");
    this.logger.log(codigoPostal);

    if (!this.val.isEmpty(codigoPostal)) {
      this.codigoPostal = codigoPostal;
      this.basicos.codPostal = codigoPostal.codPostal;
      this.basicos.cveEstado = codigoPostal.cveEstado;
      this.basicos.cveCiudad = codigoPostal.cveCiudad;
      this.validaRestriccionEstado();
    } else {
      this.codigoPostal = {};
      this.basicos.codPostal = null;
      this.basicos.cveEstado = null;
      this.basicos.cveCiudad = null;
    }
  }

  validaRestriccionEstado() {
    this.api.getRestriccionEstado(Number(this.codigoPostal.cveEstado))
      .subscribe(
        result => {
          this.logger.log("Restricción Estado");
          this.logger.log(result);
          if (result.status) {
            this.showErrorAcceso("El Estado tiene restricción, no es posible continuar con la venta");
            this.bndErrorAcceso = true;
          } else {
            this.validaRestriccionCP();
          }
        },
        error => {
          this.logger.error("Error en consulta Restricción Estado");
          this.logger.error(<any>error);
        }
      );
  }

  validaRestriccionCP() {
    this.api.getRestriccionCP(this.codigoPostal.codPostal)
      .subscribe(
        result => {
          this.logger.log("Restricción CP");
          this.logger.log(result);
          if (result.status) {
            this.showErrorAcceso("El CP tiene restricción, no es posible continuar con la venta");
            this.bndErrorAcceso = true;
          }
        },
        error => {
          this.logger.error("Error en consulta Restricción CP");
          this.logger.error(<any>error);
        }
      );
  }

  /**********************************************************/


  /*** Validaciones  *******************************************/

  validacionesPrevias() {
    this.bndErrorAcceso = false;

    this.api.getProducto()
      .pipe(
        map(result => {
          if (result.cveStatus != "A") {
            throw new Error('No está activo el producto');
          }
          else {
            return result;
          }
        }
        ),
        catchError(error => {
          this.showErrorAcceso("El producto de Casa Habitación no está activo actualmente, no es posible realizar ventas.");
          this.bndErrorAcceso = true;
          throw new Error('Error en consulta al Producto');
        })
      )
      .subscribe((result) => {
        this.logger.log("Producto");
        this.logger.log(result);
        this.productoActual = result;
        this.storage.setItem("productoActual", result);

        this.api.getTipoMoneda(result.cveMoneda)
          .subscribe(
            (moneda: TcMoneda) => {
              this.logger.log("moneda");
              this.logger.log(moneda);
              this.storage.setItem("moneda", moneda);
            },
            error => {
              this.logger.error("Error en consulta al Tipo de moneda");
              this.logger.error(<any>error);
            }
          );

        this.api.getAccesoSesion()
          .subscribe(
            result => {
              this.logger.log("Acceso sesión");
              this.logger.log(result);
              if (!result.status) {
                this.showErrorAcceso("No es un horario autorizado para realizar la venta del producto. Favor de intentarlo más tarde");
                this.bndErrorAcceso = true;
              }
            },
            error => {
              this.logger.error("Error en consulta Acceso Sesión");
              this.logger.error(<any>error);
            }
          );

      })
  }

  validarDigitoVerificador(numCuenta: string): Observable<boolean> {
    //Validar el dígito verificador Cuenta principal
    if (!this.val.validaCuentaDigVerificador(numCuenta)) {
      this.showError("Validar dígito verificador cuenta principal");
      this.logger.error("Error en el dígito verificador cuenta principal");
      return new Observable(subscriber => subscriber.next(false));
    }
    else {
      return new Observable(subscriber => subscriber.next(true));
    }
  }

  validaCuentas(): boolean {

    this.cuentasAlternativas = this.storage.getItem("cuentasAlternativas") == null ? {} : this.storage.getItem("cuentasAlternativas");
    this.obtenerTiposPago();

    if (!this.val.isEmpty(this.basicos.numCuenta)) {
      //Validar cuenta principal con cuentas alternativas
      if (!this.val.isEmpty(this.basicos.numCuenta2)) {
        if (this.basicos.numCuenta == this.basicos.numCuenta2) {
          this.numCuentaComponent.showError("La cuenta alternativa 1 es similar a la cuenta principal");
          return false;
        }
      }
      if (!this.val.isEmpty(this.basicos.numCuenta3)) {
        if (this.basicos.numCuenta == this.basicos.numCuenta3) {
          this.numCuentaComponent.showError("La cuenta alternativa 2 es similar a la cuenta principal");
          return false;
        }
      }
    }

    return true;
  }

  obtenerTiposPago() {

    this.cuentasAlternativas.numCuenta = this.basicos.numCuenta;

    if (!this.val.isEmpty(this.cuentasAlternativas.numCuenta)) {
      this.cuentasAlternativas.tipoPago = this.val.getTipoPagoCuenta(this.cuentasAlternativas.numCuenta);
    }
    if (!this.val.isEmpty(this.cuentasAlternativas.numCuenta2)) {
      this.cuentasAlternativas.tipoPago2 = this.val.getTipoPagoCuenta(this.cuentasAlternativas.numCuenta2);
    }
    if (!this.val.isEmpty(this.cuentasAlternativas.numCuenta3)) {
      this.cuentasAlternativas.tipoPago3 = this.val.getTipoPagoCuenta(this.cuentasAlternativas.numCuenta3);
    }

    this.storage.setItem("cuentasAlternativas", this.cuentasAlternativas);
  }

  validarBinCuenta(numCuenta: string): Observable<any> {

    return this.api.validarBinBanco(this.val.getBinBanco(numCuenta));

    // return this.api.validarBinBanco(this.val.getBinBanco(numCuenta))
    //   .pipe(
    //     map(
    //       result => {
    //         this.logger.log("validarBinCuenta");
    //         this.logger.log(result);
    //         return result.status;
    //       }
    //     ),
    //     catchError(error => {
    //       this.logger.error("Error en validación del bin del banco");
    //       this.logger.error(<any>error);
    //       return of([false]);
    //     })
    //   );
  }

  validaDomicilio(): boolean {
    let res: boolean = true;
    this.domicilio = {};
    this.domicilio.codPostalBien = this.basicos.codPostal;
    this.domicilio.cveEstadoBien = this.basicos.cveEstado;
    this.domicilio.cveCiudadBien = this.basicos.cveCiudad;
    this.domicilio.desDomBien = this.basicos.desDomicilio;
    this.domicilio.desColBien = this.basicos.desColonia;
    this.domicilio.numExtBien = this.basicos.numExt;
    this.domicilio.numIntBien = this.basicos.numInt;
    if (!this.api.validarDomicilio(this.domicilio)) {
      this.txtErrorFormulario = "No es posible continuar con la venta, domicilio registrado previamente.";
      res = false;
    }

    return res;
  }

  validaForm(): boolean {
    let res: boolean = true;

    if (!this.nomContratanteComponent.valida()) {
      res = false;
    }
    if (!this.apeContratanteComponent.valida()) {
      res = false;
    }
    if (!this.numCuentaComponent.valida(false)) {
      res = false;
    }
    if (!this.validaCuentas()) {
      res = false;
    }
    if (!this.titularAseguradoComponent.valida()) {
      res = false;
    }
    //se quita la validación del CP porque se activa al presionar el botón

    if (!this.desDomicilioComponent.valida()) {
      res = false;
    }
    if (!this.numExtComponent.valida()) {
      res = false;
    }
    if (!this.bndPagaRentaComponent.valida()) {
      res = false;
    }

    return res;
  }

  /**********************************************************/

  /*** Show Errores *****************************************/

  showError(error: string) {
    this.showErrorCore("Error en el formulario:", error);
  }

  showErrorCore(tipoError: string, error: string) {
    this.mensajeError = new MensajeError(tipoError,
      error,
      true
    );
  }

  showErrorAcceso(error: string) {
    this.bndErrorAcceso = true;
    this.errorAcceso = error;
  }

  /**********************************************************/

  /*** Botones ********************************************/
  nueva() {
    this.ngOnInit();
  }

  show(value) {
    // this.logger.log("show");
    // this.logger.log(value.controls);
  }

  continuar() {

    this.logger.log("continuar");

    this.txtErrorFormulario = "Existen campos incorrectos en el formulario, debes corregirlos para continuar";
    this.spinner_text = "Validando información ...";

    this.spinner.show();

    if (this.validaForm()) {

      setTimeout(() => {
        this.storage.setItem("basicos", this.basicos);
        this.storage.setItem("codigoPostal", this.codigoPostal);
        this.storage.setItem("bndPagaRenta", this.bndPagaRenta);
        this.spinner.hide();
        this.router.navigate(['/datos-inmueble']);
      }, 1000);
    } else {
      this.showError(this.txtErrorFormulario);
      this.spinner.hide();
    }
  }

  /**********************************************************/

}
