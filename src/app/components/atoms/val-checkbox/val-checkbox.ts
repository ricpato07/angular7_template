import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CheckboxItem } from '../../../models/atoms/CheckboxItem';
import { ValidacionesService } from '../../../services/validaciones.service';
import { Logger } from '../../../services/logger.service';
import { DataRestService } from '../../../services/data-rest.service';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ValCheckboxComponent),
  multi: true
};

@Component({
  selector: 'app-val-checkbox',
  templateUrl: './val-checkbox.component.html',
  providers: [customValueProvider]
})
export class ValCheckboxComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() grid: string;
  @Input() name: string;
  @Input() required: boolean;
  @Input() validar: boolean;
  @Input() options = Array<CheckboxItem>();
  @Input() selectedValues: string[];
  @Output() toggle = new EventEmitter<any[]>();
  error: boolean = false;
  mensajeError: string;

  constructor(
    private val: ValidacionesService,
    private logger: Logger,
    private api: DataRestService
  ) {
    this.validar = true;
  }

  ngOnInit() {

    if (this.selectedValues != null) {
      this.options.forEach(item => {
        for (var sel of this.selectedValues) {
          if (sel == item.value) {
            item.checked = true;
            break;
          }
        }
      });
    }
  }

  onToggle() {
    const checkedOptions = this.options.filter(x => x.checked);
    this.selectedValues = checkedOptions.map(x => x.value);
    this.toggle.emit(this.selectedValues);
  }

  valida(): boolean {
    this.error = false;

    if (this.validar) {
      if (this.required) {
        if (this.val.isEmpty(this.selectedValues)) {
          this.mensajeError = `Error el campo de '${this.label}' debe seleccionarse una opción`;
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
    this.propagateChange(event.target.value);
  }

  /* ************************************************/  

}
