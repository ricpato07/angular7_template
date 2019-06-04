import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Opcion } from 'src/app/models/atoms/Opcion';

@Component({
  selector: 'app-val-combo',
  templateUrl: './val-combo.component.html',
  styles: []
})
export class ValComboComponent implements OnInit {
selected : any;

  @Input() label: String; 
  @Input() placeholder: string; 
  @Input() required: boolean; 
  @Input() grid: string;
  @Input() name: string;
  @Input() elementos: Opcion[];
  @Output() change: EventEmitter<String> = new EventEmitter(); 
  @Output() elementosChange: EventEmitter<Opcion[]> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    
  }

  onChange(){
    console.log("change");
    console.log(this.selected);
    this.change.emit(this.selected);
  }

}
