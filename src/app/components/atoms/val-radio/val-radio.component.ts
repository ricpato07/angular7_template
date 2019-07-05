import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Opcion } from '../../../models/atoms/Opcion';
import { ValidacionesService } from '../../../services/validaciones.service';
import { Logger } from '../../../services/logger.service';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ValRadioComponent),
  multi: true
};

@Component({
  selector: 'app-val-radio',
  templateUrl: './val-radio.component.html',
  providers: [customValueProvider]
})

export class ValRadioComponent implements OnInit, ControlValueAccessor {
  @Input() grid: string;
  @Input() label: string;
  @Input() name: string;
  @Input() required: boolean = false;
  @Input() validar: boolean;
  @Input() deshabilitar: boolean;
  @Output() radioSelectedEmiter = new EventEmitter<string>();
  @Output() respuestasChange = new EventEmitter<Opcion[]>();
  radioSelected: string;
  opcionesRadio: Opcion[];
  error: boolean = false;
  mensajeError: string;

  constructor(
    private val: ValidacionesService,
    private logger: Logger
  ) {
    this.grid = "col-md-3";
    this.error = false;
    this.deshabilitar = false;
    this.validar = true;
    this.radioSelected = null;
  }

  ngOnInit() {
  }


  @Input()
  get opciones() {
    return this.opcionesRadio;
  }

  set opciones(val) {
   
    if (!this.val.isEmpty(val)) {
      this.opcionesRadio = val;

      for (var item of this.opcionesRadio) {
        if (item.selected) {
          this.onItemChange(item.value);
          break;
        }
      }
      this.respuestasChange.emit(this.opcionesRadio);
    }
  }

  onItemChange(value) {
    this.radioSelected = value;
    this.radioSelectedEmiter.emit(this.radioSelected);
    this.propagateChange(value);
  }

  valida(): boolean {
    this.error = false;

    if (this.validar) {
      if (this.required) {
        if (this.val.isEmpty(this.radioSelected)) {
          this.mensajeError = `Error se debe seleccionar una opción del campo`;
          this.error = true;
          return false;
        }
      }
    }
    return true;
  }

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
    this.radioSelected = event.target.value;
    this.radioSelectedEmiter.emit(this.radioSelected);
    this.propagateChange(event.target.value);
  }

  /****************************************************/

}
