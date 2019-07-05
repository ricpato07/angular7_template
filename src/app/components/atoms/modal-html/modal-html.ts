import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-html',
  templateUrl: './modal-html.component.html'
})
export class ModalHtmlComponent implements OnInit {
  @Input() show: boolean; 
  @Input() titulo: String; 
  @Input() texto: String; 
  @Input() redireccion: boolean; 
  @Input() url: string; 
  @Output() showChange: EventEmitter<boolean>; 

  constructor(private route: Router) {
    this.showChange = new EventEmitter();
    this.show = true;
    this.titulo = null;
    this.texto = null;
    this.url = null;
    this.redireccion = false;
  }

  ngOnInit() {

  }

  redireccionar(){
    this.route.navigateByUrl(this.url);
  }
}
