import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { Opcion } from '../../../models/atoms/Opcion';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const customValueProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ValSelectComponent),
  multi: true
};

@Component({
  selector: 'app-val-select',
  templateUrl: './val-select.component.html',
  providers: [customValueProvider]
})

export class ValSelectComponent implements OnInit {
  @Input() label: String; //Etiqueta del componente, es pasada por el componente padre
  @Input() placeholder: string; //Variable personaliable para el place holder del input
  @Input() required: boolean; //Bandera editable desde el componente padre
  @Input() grid: string;
  @Input() name: string;
  @Output() change: EventEmitter<String> = new EventEmitter(); //Sirve para lanzar un evento cuando algun elemento es seleccionado
  @Output() elementosChange: EventEmitter<Opcion[]> = new EventEmitter();
  elementosValues: Opcion[]; //Elementos para mostrar como seleccionables en el combobox
  error: boolean; //Bandera para mostrar errores si no se a seleccionado algun elemento
  buscar: String; //Aqui se alamcena el valor de lo que el usuario esta escribiendo para poder filtrar los elementos
  val: String; //Aqui se alamacena el valor seleccionado final, no el label
  showResultados: boolean; //bandera para mostrar los elementos que componen el select
  selected: boolean; //Bandera para verificar si es que se selecciono un elemento, de otro modo cambia la bandera de error
  mensajeError: string; //Variable que almacena los mensajes de error
  label_elements: String[];//Arreglo que muestra los labels del arreglo original para poder ejecutar el filtro

  //Valores por default
  constructor() { 
    this.error=false;
    this.buscar = "";
    this.val = "";
    this.showResultados = false;
    this.selected = false;
    this.mensajeError = "Debes seleccionar una opción";
    this.placeholder = "Seleccionar";
    this.label_elements = [];
    this.grid = "col-sm-12 col-md-6 col-lg-4";
  }

  ngOnInit() {}

  /**INICIO Funciones para el Two Way DataBinding */
  @Input()
  get elementos(){
    return this.elementosValues;
  }

  set elementos(val) {
    //Se verifica si el valor que se le quiere asignar a los datos no es nulo
    if (val != undefined && val != null) {
      this.elementosValues = val;

      //Se recorre el areglo de elementos recien actualizado para buscar en caso de que 
      //el componente tenga un valor por defecto, y se actualiza el arreglo de etiquetas
      this.elementosValues.forEach(elem => {
        if (elem.selected) {
          this.buscar = elem.label;
          this.val = elem.value;

          this.change.emit(this.val);
        }

        this.label_elements.push(elem.label);
      });
      this.elementosChange.emit(this.elementosValues);
    }
  }
  /** FIN Funciones para el Two Way DataBinding */

  /**
   * Funcion que utiliza cada elemento del combobox cuando es clickeado
   * cambia el valor de buscar y dispara el evento para que el componente
   * padre lo atrape, tambien ajusta algunos valores
   * de ser el caso tambien despliega los mensajes de 
   * error
   * 
   * @param value valor del elemento seleccionado
   */
  onClick(value: String): void{
    this.buscar = value;
    this.showResultados = false;
    this.selected = true;
    this.error=false;

    let index = this.elementosValues.findIndex(function(opcion){
        return opcion.label === value;
    });

    this.val = this.elementosValues[index].value;
    this.change.emit(this.val);
  }

  /**
   * Funcion que sirve para limpiar el combobox en 
   * caso de no ser seleccionado ningun elemento
   * de ser el caso tambien despliega los mensajes de 
   * error
   */
  clean(): void{
    this.showResultados = !(this.showResultados);

    if(this.showResultados)
      this.placeholder = "Buscar";
    else
      this.placeholder = "Seleccionar";
  }

  /**
   * Funcion que valida si ya se la variable busqueda esta vacia
   * para mover la bandera selected a falso, si es que buscar esta
   * vacia o nula cambia el componente a estado de error
   */
  validar(){
    if(this.buscar === "")
      this.selected = false;

    if((this.buscar === "" || this.buscar === undefined || this.buscar === null) && !this.selected)
      this.error = true;
  }

  test(event: KeyboardEvent){
    event.keyCode == 13 ? this.clean() : '';
  }

  /* Funciones de la clase ControlValueAccessor */
  propagateChange:any = () => {};
  
  writeValue(value: any) {
  }
  
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void { 
  }

  onChange(event){
    this.propagateChange(event.target.value);
  }

}
