import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidacionesService } from '../../../services/validaciones.service';

@Component({
  selector: 'app-val-numero',
  templateUrl: './val-numero.component.html'
})
export class ValNumeroComponent implements OnInit {
  @Input() label: string; //Variable dinamica para customizar la etiqueta del componnete
  @Input() maxlength: number;
  @Input() required: boolean;
  @Input() deshabilitar: boolean;
  @Input() grid: string;
  @Input() name: string;
  @Input() numeroValue: string; //Variable donde se alamacena el dato que sera evaluado
  @Input() usarExpReg: boolean = false; //Variable para saber si se usara o no una exp regular
  @Input() textoExpReg: string = ''; //En caso de usarse la EXPREG aqui se almacenara el texto
  @Output() numeroChange: EventEmitter<string>; //Lanzador de eventos para pasar el dato a los componentes padres
  error: boolean; //bandera para desplegar los mensajes de error
  mensajeError: string; //Variable dinamica que sirve para customizar los mensajes de error


  constructor(
    private valService: ValidacionesService
  ) {
    this.error = false;
    this.deshabilitar = false;
    this.maxlength = 10;
    this.grid = "col-sm-12 col-md-4 col-lg-3";
    this.numeroChange = new EventEmitter();
  }

  ngOnInit() { }

  /**
   * Funcion que hace las respectivas validaciones para el componnete
   * como regla de negocio:
   * -El dato debe contener solo 10 digitos
   * -El dato debe contener solo digitos del 0-9
   * -El dato no debe ser nulo
   */
  valida() {
    if (this.required) {
      if (this.valService.isEmpty(this.numeroValue)) {
        this.mensajeError = `El campo '${this.label}' no puede estar vacío`;
        this.error = true;
        this.numeroChange.emit(this.numeroValue);
        return;
      }
    }

    let regExp = new RegExp(this.textoExpReg);
    if (this.usarExpReg && !regExp.test(this.numeroValue)) {
      this.mensajeError = `Error el campo de '${this.label}' no tiene un formato correcto`;
      this.error = true;
      this.numeroChange.emit(this.numeroValue);
      return;
    }

    if (!this.valService.isEmpty(this.numeroValue)) {
      if (this.numeroValue.length != 10 && this.numeroValue.length != 16) {
        this.mensajeError = `El campo '${this.label}' debe tener 10 o 16 dígitos`;
        this.error = true;
        this.numeroChange.emit(this.numeroValue);
        return;
      }
    }

    this.error = false;
    this.numeroChange.emit(this.numeroValue);
  }
}
