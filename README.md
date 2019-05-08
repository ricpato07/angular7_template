# angular7_template
Template for Angular 7

### Puntos pendientes a revisar
- [ ] Importar en otro módulo componentes, saca errores de maxlenght
- [ ] Revisar ruta componentes en app
  11-crud/src/app/
- [ ] Generar servicio de Logger
- [ ] Constantes en Angular 7


* Importación de archivos css

`<link rel="stylesheet" href="./assets/styles.css">`

Servicios HttpClient

https://victorroblesweb.es/2017/11/06/httpclient-en-angular-5-ejemplos-servicios-ajax-rest/

## Paquetes para visual studio code
- Terminal - Jun Han
- Angular 7 Snippets - Mikael Morlund
- Prettier Code Formatter - Esben Petersen
- Material icon theme - Philipp kief
- JavaScript (ES6) code snippets - charalampos karypidis
- JSHint - Dirk Baeumer $npm install -g jshint

## Instrucciones para consola

Instalar angular cli globalmente

 `npm install -g @angular/cli@latest`

Desinstalar angularcli y borrar cache

`$ npm uninstall -g @angular/cli
$ npm cache clean`

Instalar libreria http de angular 

`npm install --save @angular/http`

Instalar paquete para desarrollo

`npm install --save-dev karma`

Desinstalar libreria 

`npm uninstall --save bootstrap`

Version angular cli

`$ ng -v`

Ayuda angular 

`$ ng --help`

Ayuda comando especifico

`$ ng --help new`

Crear nuevo proyecto 

`ng new proyecto-angular6`

Iniciar aplicacion

`npm start`

Iniciar con ng

`ng serve`

Crear un módulo llamada core

`ng g m core`

Crea una carpeta llamada navigator junto con un componente llamado navigator y su html quitando los estilos y el archivo para pruebas

`ng g c core/navigator -is --spec=false `

Crea un componente llamado header y su html dentro de la misma carpeta navigator

`ng g c core/navigator/header --flat`

Crea un modulo y html llamado home con su propio enrutamiento

`ng g m home --routing true`

Crea un nuevo servicio: EnvService , env.service.ts

`ng g s env`

Arreglar problemas de vulnerability

`npm install -g npm@latest` 
`npm cache clean --force`

Audiciones de seguridad

`npm set audit false`

Compilar para producción

`ng build --prod`

Compilar para QA, es necesario agregar la configuración en angular.json y el archivo enviroment.qa.ts

`ng build --configuration qa`

// Segundo curso *******************************************************
//instalar typescript
npm install -g typescript

//version de typescript
tsc --version

//instalar ionic
npm install -g ionic 

@ViewChild()
[https://www.concretepage.com/angular-2/angular-2-viewchild-example]

get JS file
https://www.truecodex.com/course/angular-6/how-to-use-external-js-files-and-javascript-code-in-angular

read enviroment files
https://medium.com/@balramchavan/configure-and-build-angular-application-for-different-environments-7e94a3c0af23

Local server http
https://www.npmjs.com/package/local-web-server

Injection dependency
https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f

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


