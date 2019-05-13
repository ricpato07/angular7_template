import { Component, OnInit, Input, forwardRef, Output, EventEmitter} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextoComponent),
  multi: true
};

@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  providers: [customValueProvider]
})
export class TextoComponent implements OnInit, ControlValueAccessor {
  @Input() label : string;
  @Input() textoValue: string;
  @Input() required : boolean;
  @Output() textoChange: EventEmitter<string> = new EventEmitter();
  mensajeError : string;
  error = false;
 
  constructor() { 
   // this.respuesta = new EventEmitter();
  }

  ngOnInit() {
    //this.respuesta.emit(this.apellido);
  }

  value = null;

  propagateChange:any = () => {};
  
  writeValue(value: any) {
    console.log("writeValue");
    console.log(value);
    if( value ){
      this.value = value;  
    }
  }
  
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void { 
  }


  onChange(event){
    this.propagateChange(event.target.value);
  }


  valida() {
  
      if (this.required) {
        if (this.textoValue == null || this.textoValue == "") {
          this.mensajeError = `Error el campo de '${this.label}' no puede estar vacío`;
          this.error = true;
          this.textoChange.emit(this.textoValue);
          return;
        }
      }
   
    this.error = false;
    if (this.textoValue != null && this.textoValue != "") {
      this.textoValue = this.textoValue != undefined ? this.textoValue.toUpperCase() : "";
    }
    this.textoChange.emit(this.textoValue);
  }

}
