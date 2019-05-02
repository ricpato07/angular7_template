# angular7_template
Template for Angular 7

* tomar variables de archivo en ruta definida
- @ViewChild
* create Modules
* formularios con input y output
- local storage
- logger for angular 7

Revisar:
* Importación de archivos css
* Nombre del campo utilizando #
* Uso de interfaces


Paquetes para visual studio code
-Terminal - Jun Han
-Angular 7 Snippets - Mikael Morlund
-Prettier Code Formatter - Esben Petersen
-Material icon theme - Philipp kief
-JavaScript (ES6) code snippets - charalampos karypidis
-JSHint - Dirk Baeumer $npm install -g jshint


//instalar angular cli globalmente
$ npm install -g @angular/cli@latest

//desinstalar angularcli y borrar cache
$ npm uninstall -g @angular/cli
$ npm cache clean

//instalar libreria http de angular 
npm install --save @angular/http

//instalar paquete para desarrollo
npm install --save-dev karma

//desinstalar libreria 
npm uninstall --save bootstrap

//version angular cli
$ ng -v
//ayuda angular 
$ ng --help
//ayuda comando especifico
$ ng --help new

// crear nuevo proyecto 
ng new proyecto-angular6
//ng new astrobot --routing -s -S

//iniciar aplicacion
npm start

//iniciar con ng
ng serve

//crear un módulo llamada core
ng g m core

//crea una carpeta llamada navigator junto con un componente llamado navigator y su html quitando los estilos y el archivo para pruebas
ng g c core/navigator -is --spec=false 

//crea un componente llamado header y su html dentro de la misma carpeta navigator
ng g c core/navigator/header --flat

//crea un modulo y html llamado home con su propio enrutamiento
ng g m home --routing true

//crea un nuevo servicio: EnvService , env.service.ts
ng g s env

//arreglar problemas de vulnerability
npm install -g npm@latest 
npm cache clean --force

//audiciones de seguridad
npm set audit false

//compilar para producción
ng build --prod

// Segundo curso *******************************************************
//instalar typescript
npm install -g typescript

//version de typescript
tsc --version

//instalar ionic
npm install -g ionic 

// **Componentes ********************************************************
//parametros opcionales , no pueden venir los parametros opcionales al principio
ejecuta(nombre:string="Nombre por defecto", apellidos:string, edad?:number)

//recuperar variables de un objeto
public identity={
	id:1,
	web: 'www.hotmail.com',
	tematica:'Correo electronico'
} 
let {id, web}=this.identity;

//recuperar valores de un arreglo 
let avengers:string[] = ["uno","dos","tres"];
let [num_uno,num_dos, num_tres] = avengers;

//condición if
<div *ngIf="trabajador_externo == false"></div>

//evento click 
<button (click)="cambiarExterno()">Mostrar Externo</button>

//concidión swtich y switchCase
<ul [ngSwitch]="color">
	<li *ngSwitchCase="'red'" 
	
//propiedad ngStyle
[ngStyle]="{'background':color,
			'color' : 'white',
			'padding' : '20px'
			}">	

//propiedad style como atributo
<pre [style.border]="color == 'red'?'5px solid black':'1px solid green'">

//propiedad class
[class.fondoAzul]="color == 'blue'"

//ngClass condicional
<pre [ngClass]="{
   			 fondoAzul : color == 'blue',
             fondoVerde : color == 'green'
         }">
//ngClass fijo en arreglo
<pre [ngClass]="['fondoAzul','letraGrande']">		 

//two way data binding
<input type="text" [(ngModel)]="color" />

//pipe fecha
{{fecha | date:'dd/MM/yyyy'}}

//pipe uppercase
{{fecha | uppercase}}

//rutas de navegación
configurar el archivo app.routing.ts
//agregar esta etiqueta en el main de app.component
<router-outlet></router-outlet>

//routerLink, es necesario configurar el app.routing.ts 
<li class="nav-item" routerLinkActive="active">
	<a class="nav-link" [routerLink]="['home']">Home</a>
</li>

//Configuración del módulo HttpClient
 //configurar en el archivo app.module.ts
 //Importar HttpClientModule
import {HttpClientModule} from '@angular/common/http';
..
imports: [
    HttpClientModule, // cargamos el módulo en el array de imports
  ],

//Configurar en el servicio.ts 
import {HttpClient, HttpHeaders} from '@angular/common/http';

//variable directa en constructor
constructor(
    public http: HttpClient
){}

getProductos():Observable<any>{
	return this._http.get(this.url+'productos');
}

// obtener datos desde el componente 
getProductos(){
		this._productoService.getProductos().subscribe(
			result => {
				if(result.code != 200){
					console.log(result);
				}else{
					this.productos = result.data;
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

//formulario
<form #formProducto="ngForm" (ngSubmit)="onSubmit()" class="col-lg-6" id="form-producto">

//inputText
<label>
	Nombre
	<span *ngIf="!nombre.valid && nombre.touched" class="label label-danger">El nombre es obligatorio</span>
</label>
<input type="text" #nombre="ngModel" name="nombre" [(ngModel)]="producto.nombre" class="form-control" required />	

//botón submit
<input type="submit" value="{{titulo}}" [disabled]="!formProducto.form.valid" class="btn btn-success"/>

@ViewChild()
https://www.concretepage.com/angular-2/angular-2-viewchild-example

get JS file
https://www.truecodex.com/course/angular-6/how-to-use-external-js-files-and-javascript-code-in-angular

