export class Empleado{
	// Forma clásica
	/*
	public nombre:string;
	public edad:number;
	public cargo:string;
	public contratado:boolean;

	constructor(nombre, edad,cargo,contratado){
	  this.nombre = nombre;
	  this.edad = edad;
	  this.cargo= cargo;
	  this.contratado = contratado;
	}
	*/
	
	constructor(
		public nombre:string,
		public edad:number,
		public cargo:string,
		public contratado:boolean
		)
		{}
			
}