import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ValidacionesService } from 'src/app/services/validaciones.service';

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
  @Input() label: string; //Variable dinamica para customizar la etiqueta del componente
  @Input() deshabilitar: boolean; //Variable para deshabilitar el componente
  @Input() grid: string; //Variable personalizable desde el componente padre para saber el tamaño total que tendra el componente sobre la malla
  @Input() validar: boolean; //Bandera personalizable desde el componente pare para validar si es que se debe verificar el contenido del texto
  @Input() placeholder: string; //Variable personalizable desde el componente padre
  @Input() required: boolean; //Bandera para saber si el campo es requerido
  @Input() textoValue: string; //Variable donde se alamacena el texto
  @Input() usarExpReg: boolean = false; //Variable para saber si se usara o no una exp regular
  @Input() textoExpReg: string = ''; //En caso de usarse la EXPREG aqui se almacenara el texto
  @Input() maxlength: number = 50; //Variable personalizable desde el componente padre
  @Input() upperCase: boolean; // bandera para indicar si se cambia a mayusculas
  @Input() name: string; // nombre del componente
  @Output() textoChange: EventEmitter<string> = new EventEmitter(); //Lanzador de eventos para pasar el dato a los components padres
  error: boolean = false; //bandera para desplegar los mensajes de error
  mensajeError: string; //Variable dinamica que sirve para customizar los mensajes de error

  constructor(
    private valService: ValidacionesService
  ) {
    this.validar = true;
    this.deshabilitar = false;
    this.required = false;
    this.grid = "col-sm-12 col-md-4 col-lg-3";
    this.placeholder = "";
    this.upperCase = false;
  }

  ngOnInit() { }

  valida(): boolean {

    console.log("valida ValTextoComponent");
    this.error = false;

    if (this.validar) {

      if (this.required) {
        console.log(this.textoValue);
        if (this.valService.isEmpty(this.textoValue)) {
          this.mensajeError = `Error el campo de '${this.label}' no puede estar vacío`;
          this.error = true;
          this.textoChange.emit(this.textoValue);
          return false;
        }
      }

      if (!this.valService.isEmpty(this.textoValue)) {
        let regExp = new RegExp(this.textoExpReg);
        if (this.usarExpReg && !regExp.test(this.textoValue)) {
          this.mensajeError = `Error el campo de '${this.label}' no tiene un formato correcto`;
          this.error = true;
          this.textoChange.emit(this.textoValue);
          return false;
        }
      }

    }

    if (this.upperCase && !this.valService.isEmpty(this.textoValue)) {
      this.textoValue = this.textoValue != undefined ? this.textoValue.toUpperCase() : "";
    }

    this.textoChange.emit(this.textoValue);
    return true;
  }

  /* Funciones de la clase ControlValueAccessor */
  
  writeValue(value: any) {
  }

  registerOnTouched(fn: () => void): void {
  }


  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  propagateChange: any = () => { };

  onChange(event) {
    console.log("onChange");
    this.propagateChange(event.target.value);
  }


  // validates the form, returns null when valid else the validation object
  public validate(c: FormControl) {

    console.log("validate");
    console.log(c);
    console.log(c.dirty);

    if(c.dirty && !this.valida()){
      return {
        error:{
          valid : false,
          message: this.mensajeError
        }
      }
    }
    return null;
  }

}
