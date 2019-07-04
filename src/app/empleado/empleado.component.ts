import{Component} from '@angular/core';
import{Empleado} from './empleado';

@Component({
	selector: 'empleado-tag',
	templateUrl: './empleado.component.html'
	})
export class EmpleadoComponent{
	public titulo = 'Titulo del componente empleado';
	public titulo_privado:string = 'titulo privado';
	public edad:number = 20;
	public mayoredad:boolean = true;
	public trabajos:Array<string> = ['Plomero','Carpintero','Electricista'];
	public cosas:Array<any> = ['Plomero', 89];
	public empleado:Empleado;
	public trabajadores:Array<Empleado>;
	public trabajador_externo:boolean;
	public color:string;

	constructor(){
		console.log(this.trabajos);
		this.empleado = new Empleado("David Lopez", 45,'cocinero', true);
		this.trabajadores = [
		  new Empleado("Ernesto Dalesio", 38,'administrativo', true),
		  new Empleado("Juan Fernandez", 45,'cocinero', true),
		  new Empleado("Ana Lopez", 34,'secretaria', true),
		  new Empleado("Roberto Cruz", 60,'intendencia', false)
		];
		this.trabajador_externo = true;
		this.color = "green";
	}

	ngOnInit(){
		//this.holamundo();
		//variables
		var uno = 1;
		var dos = 8;
		if(uno === 1){
			let uno = 2;
			var dos = 9;
			console.log("Entro al if: "+ uno+" "+dos);
		}
		console.log("Valor de uno: "+ uno);
		console.log("Valor de dos: "+ dos);
	
		console.log(this.empleado);
		console.log(this.trabajadores);
	}

	holamundo(){
		alert("hola mundo");
	}

	cambiarExterno(){
		this.trabajador_externo = !this.trabajador_externo;
	}
}