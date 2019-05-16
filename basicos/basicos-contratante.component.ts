import { Component, OnInit, ViewChild } from '@angular/core';
import { HbctTcCasaHabi } from '../../models/database/HbctTcCasaHabi';
import { Opcion } from '../../models/atoms/Opcion';
import { Logger } from '../../services/logger.service';
import { StorageService } from '../../services/storage.service';
import { Cuentas } from '../../models/atoms/Cuentas';
import { ModalCuentasComponent } from '../atoms/modal-cuentas/modal-cuentas.component';
import { Constants } from '../../globals/constants';
import { Router } from '@angular/router';
import { CodigoPostal } from '../../models/atoms/CodigoPostal';
import { ValidacionesService } from '../../services/validaciones.service';
import { ValTextoComponent } from '../atoms/val-texto/val-texto.component';
import { MensajeError } from '../../models/atoms/MensajeError';
import { ValNumeroComponent } from '../atoms/val-numero/val-numero.component';
import { ValCheckboxComponent } from '../atoms/val-checkbox/val-checkbox.component';
import { ValRadioComponent } from '../atoms/val-radio/val-radio.component';
import { ValCodigoPostalComponent } from '../atoms/val-codigo-postal/val-codigo-postal.component';


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
  cuentasAlternativas: Cuentas;
  mensajeError: MensajeError;

  showModal: boolean;
  bndPagaRenta: number;
  opcionesTitular: Opcion[];
  opcionesPagaRenta: Opcion[];


  @ViewChild('modal_cuentas') private modalCuentasComponent: ModalCuentasComponent;
  @ViewChild('nom_contratante') private nomContratanteComponent: ValTextoComponent;
  @ViewChild('ape_contratante') private apeContratanteComponent: ValTextoComponent;
  @ViewChild('num_cuenta') private numCuentaComponent: ValNumeroComponent;
  @ViewChild('titular_asegurado') private titularAseguradoComponent: ValRadioComponent;
  @ViewChild('codigo_postal') private codigoPostalComponent: ValCodigoPostalComponent;
  @ViewChild('des_domicilio') private desDomicilioComponent: ValTextoComponent;
  @ViewChild('num_ext') private numExtComponent: ValNumeroComponent;
  @ViewChild('bnd_paga_renta') private bndPagaRentaComponent: ValRadioComponent;


  constructor(
    private logger: Logger,
    private storage: StorageService,
    private router: Router,
    private val: ValidacionesService
  ) {
    this.name_pattern = Constants.NOMBRE_PATTERN;
    this.integer_pattern = Constants.INTEGER_PATTERN;
    this.num_casa_pattern = Constants.NUM_CASA_PATTERN;

    this.basicos = {};
    this.opcionesTitular = [{ label: "Si", value: "1", selected: true },
    { label: "No", value: "0", selected: false },
    ];
    this.bndPagaRenta = 0;
    this.opcionesPagaRenta = [{ label: "Si", value: "1", selected: false },
    { label: "No", value: "0", selected: true },
    ];
    this.codigoPostal = {};
    this.cuentasAlternativas = {};
    this.mensajeError = new MensajeError();
  }

  ngOnInit() {
    this.logger.log("(ngOnInit) BasicosContratanteComponent");
    this.storage.clearAll();
  }

  mostrarModal() {
    this.showModal = true;
    this.modalCuentasComponent.loadCuentasShare();
  }

  addCuentasAlternativas(event: boolean) {
    this.showModal = false;

    this.cuentasAlternativas = this.storage.getItem("cuentasAlternativas");
    if (this.cuentasAlternativas != null) {
      this.basicos.numCuenta2 = this.cuentasAlternativas.numCuenta2;
      this.basicos.numCuenta3 = this.cuentasAlternativas.numCuenta3;
    }

  }

  codigoPostalResponse(codigoPostal) {
    this.logger.log("codigoPostalResponse");
    this.logger.log(codigoPostal);
    
    if (!this.val.isEmpty(codigoPostal)) {
      this.codigoPostal = codigoPostal;
      this.basicos.codPostal = codigoPostal.codigo_postal;
      this.basicos.cveEstado = codigoPostal.cve_estado;
      this.basicos.cveCiudad = codigoPostal.cve_ciudad;
    }else{
      this.codigoPostal = {};
      this.basicos.codPostal = null;
      this.basicos.cveEstado = null;
      this.basicos.cveCiudad = null;
    }
  }

  continuar() {

    if (this.validaForm()) {
      this.logger.log("Continuar");
      this.storage.setItem("basicos",this.basicos);
      this.storage.setItem("codigoPostal",this.codigoPostal);
      this.storage.setItem("bndPagaRenta",this.bndPagaRenta);
    } else {
      this.showError("Existen campos incorrectos en el formulario, debes corregirlos para continuar");
    }

    //this.router.navigate(['datos-inmueble']);
  }

  validaForm(): boolean {
    let res: boolean = true;

    if (!this.nomContratanteComponent.valida()) {
      res = false;
    }
    if (!this.apeContratanteComponent.valida()) {
      res = false;
    }
    if (!this.numCuentaComponent.valida()) {
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

  showError(error: string) {
    this.mensajeError = new MensajeError("Error en el formulario:",
      error,
      true
    );
  }

}
