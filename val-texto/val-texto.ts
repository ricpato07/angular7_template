import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ValidacionesService } from '../../../services/validaciones.service';

@Component({
  selector: 'app-val-texto',
  templateUrl: './val-texto.component.html'
})
export class ValTextoComponent implements OnInit {
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
    private valService : ValidacionesService
  ) {
    this.validar = true;
    this.deshabilitar = false;
    this.required = false;
    this.grid = "col-sm-12 col-md-4 col-lg-3";
    this.placeholder = "";
    this.upperCase = false;
  }

  ngOnInit() { }

  /**
   * Funcion que valida que el texto no este vacio
   * y emite un evento para pasar el contenido de la
   * variable al componente padre
   */
  valida() {
    if (this.validar) {
      if (this.required) {
        if (this.valService.isEmpty(this.textoValue)) {
          this.mensajeError = `Error el campo de '${this.label}' no puede estar vacío`;
          this.error = true;
          this.textoChange.emit(this.textoValue);
          return;
        }
      }

      let regExp = new RegExp(this.textoExpReg);
      if (this.usarExpReg && !regExp.test(this.textoValue)) {
        this.mensajeError = `Error el campo de '${this.label}' no tiene un formato correcto`;
        this.error = true;
        this.textoChange.emit(this.textoValue);
        return;
      }
    }

    this.error = false;
    if (this.upperCase && !this.valService.isEmpty(this.textoValue)) {
      this.textoValue = this.textoValue != undefined ? this.textoValue.toUpperCase() : "";
    }
    this.textoChange.emit(this.textoValue);
  }

}
