import {Component} from '@angular/core';
import {Coche} from './coche';
import {PeticionesService} from '../services/peticiones.service';

@Component({
	selector: 'coches',
	templateUrl: './coches.component.html',
	providers: [PeticionesService]
	})
export class CochesComponent{
 public coche:Coche;
 public coches:Array<Coche>;
 public articulos;

 constructor(
 	private _peticionesService:PeticionesService
 	){
 	this.coche = new Coche("",null,"");
 	this.coches = [
      new Coche("Seat Panda",120,"Blanco"),
      new Coche("Peageot 206",110,"Rojo")
 	];
 }

 ngOnInit(){
 	this._peticionesService.getArticulos().subscribe(
 	result => {
 		 console.log(result);
 		 this.articulos = result;
              /*  if(result.code != 200){
                    console.log(result);
                }else{
                    this.productos = result.data;
                }*/
            },
            error => {
                console.log(<any>error);
            }
   );
 }

 onSubmit(){
 	this.coches.push(this.coche);
 	this.coche = new Coche("",null,"");
 }
}
