import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-mensaje-error',
  templateUrl: './mensaje-error.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class MensajeErrorComponent implements OnInit {
  @Input() heading: String; //Variable que almacena el encabezado del error
  @Input() mensaje: String; //Variable que almacena el mensaje del error
  @Input() show:boolean; //Variale que almacena el estado del componente si se muestra o no
  @Input() time: number; //Variable que define el tiempo que se mostrara el mensaje
  @Output() showEvent: EventEmitter<boolean>; //Manejador de eventos que se encara de pasar el valor al componente padre

  constructor() {
    this.heading = "HEADING"
    this.mensaje = "MENSAJE";
    this.show = false;
    this.time = 5500;
    this.showEvent = new EventEmitter();
  }

  ngOnInit() {}

  /**
   * Funcion que oculta el mensaje de error y emite el contenido de la variable show
   * para los componentes padres
   */
  ocultar():void{
    this.show = false;
    this.showEvent.emit(this.show);
  }
}
