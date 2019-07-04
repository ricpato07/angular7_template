import {Component} from '@angular/core';
import {RopaService} from '../services/ropa.service';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	providers: [RopaService]
	})

export class HomeComponent{
	public titulo = "Página principal";
	public listado_ropa : Array<string>;
	public prenda_a_guardar:string;
	public fecha;

	constructor(
		private _ropaService:RopaService
		){
		this.fecha = new Date(2019,1,28);
	}

	ngOnInit(){
		this.listado_ropa = this._ropaService.getRopa();
		console.log(this.listado_ropa);
	}

	guardar_prenda(){
		this._ropaService.addRopa(this.prenda_a_guardar);
		this.prenda_a_guardar = null;
	}

	eliminarPrenda(i:number){
		this._ropaService.deleteRopa(i);
	}
}