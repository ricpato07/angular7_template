import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { ValidacionesService } from '../../../services/validaciones.service';
import { Tooltip } from '../../../models/atoms/Tooltip';
import { Logger } from '../../../services/logger.service';
import { DataRestService } from '../../../services/data-rest.service';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ValTextoComponent),
  multi: true
};

const cumtomValidatorProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ValTextoComponent),
  multi: true,
}

@Component({
  selector: 'app-val-texto',
  templateUrl: './val-texto.component.html',
  providers: [customValueProvider, cumtomValidatorProvider]
})

export class ValTextoComponent implements OnInit, ControlValueAccessor, Validator {
  error: boolean = false;
  mensajeError: string;
  showLink: boolean;
  tooltip: Tooltip;
  showModalInfo: boolean;
  value: string;

  @Input() label: string;
  @Input() deshabilitar: boolean;
  @Input() grid: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() readonly: boolean;
  @Input() textoValue: string;
  @Input() usarExpReg: boolean = false;
  @Input() textoExpReg: string = '';
  @Input() maxlength: number = 50;
  @Input() upperCase: boolean;
  @Input() name: string;
  @Input() infoLabel: string;
  @Output() textoChange = new EventEmitter<string>();
  @Output() validResponse = new EventEmitter<boolean>();


  constructor(
    private val: ValidacionesService,
    private logger: Logger,
    private api: DataRestService
  ) {
    this.deshabilitar = false;
    this.readonly = false;
    this.required = false;
    this.grid = "col-sm-12 col-md-4 col-lg-3";
    this.placeholder = "";
    this.upperCase = false;
    this.tooltip = new Tooltip(null, null, null);
  }

  ngOnInit() {
    this.showLink = this.infoLabel != null;
  }


  valida(responseValid: boolean = true): boolean {
    this.error = false;

    if (this.required) {
      if (this.val.isEmpty(this.textoValue)) {
        this.mensajeError = `Error el campo ${this.label} no puede estar vacío`;
        this.error = true;
        this.textoChange.emit(this.textoValue);
        return false;
      }
    }

    if (!this.val.isEmpty(this.textoValue)) {
      let regExp = new RegExp(this.textoExpReg);
      if (this.usarExpReg && !regExp.test(this.textoValue)) {
        this.mensajeError = `Error el campo ${this.label} no tiene un formato correcto`;
        this.error = true;
        this.textoChange.emit(this.textoValue);
        return false;
      }
    }

    if (this.upperCase && !this.val.isEmpty(this.textoValue)) {
      this.textoValue = this.textoValue != undefined ? this.textoValue.toUpperCase() : "";
    }

    this.textoChange.emit(this.textoValue);
    if (responseValid) {
      this.validResponse.emit(true);
    }

    return true;
  }

  showError(error) {
    this.mensajeError = error;
    this.error = true;
  }

  /** Modal tooltip **************************************************/

  showInfo() {
    this.tooltip = this.val.getInfoLabel(this.infoLabel);
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

  /****************************************************/

  /* Funciones de la clase ControlValueAccessor ******/
  propagateChange: any = () => { };

  writeValue(value: any) {
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
  }

  onChange(event) {
    this.propagateChange(event.target.value);
  }

  /* validates the form, returns null when valid else the validation object */

  public validate(c: FormControl) {

    if (c.dirty && !this.valida(false)) {
      return {
        error: {
          valid: false,
          message: this.mensajeError
        }
      }
    }
    return null;
  }

  /****************************************************/

}
