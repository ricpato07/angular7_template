# Angular7 template
**Contenido**
- [Puntos pendientes a revisar](#puntos-pendientes-a-revisar)
- [Paquetes para visual studio code](#paquetes-para-visual-studio-code)
- [Instrucciones para consola](#instrucciones-para-consola)
- [Código util](#código-util)
- [Enlaces externos](#enlaces-externos)



### Puntos pendientes a revisar ###
- [ ] No reconoce el pattern en el custom component
- [ ] Revisar ruta componentes en app
      11-crud/src/app/components
- [ ] Revisar extends a class, hacer la prueba para extender un componente, se pasan sus variable al html del hijo?

https://devblogs.microsoft.com/premier-developer/angular-how-to-simplify-components-with-typescript-inheritance/

- [ ] Como implementar JQuery en Angular
- [ ] Como utilizar identificadores en forms de template

https://medium.com/@bohndez.dev/custom-form-control-con-control-value-accessor-en-angular-5-6-o-7-f8f4030f105d






## Paquetes para Visual studio code ##
- Terminal - Jun Han
- Angular 7 Snippets - Mikael Morlund
- Prettier Code Formatter - Esben Petersen
- Material icon theme - Philipp kief
- JavaScript (ES6) code snippets - charalampos karypidis
- JSHint - Dirk Baeumer $npm install -g jshint

## Instrucciones para consola ##

- Instalar angular cli globalmente

 	`npm install -g @angular/cli@latest`

- Desinstalar angularcli y borrar cache

	```
	$ npm uninstall -g @angular/cli

	$ npm cache clean
	```

- Instalar libreria http de angular 

	`npm install --save @angular/http`

- Instalar paquete para desarrollo

	`npm install --save-dev karma`

- Desinstalar libreria 

	`npm uninstall --save bootstrap`

- Version angular cli

	`$ ng -v`

- Ayuda angular 

	`$ ng --help`

- Ayuda comando especifico

	`$ ng --help new`

- Crear nuevo proyecto 

	`ng new proyecto-angular6`

- Iniciar aplicacion

	`npm start`

- Iniciar con ng

	`ng serve`

- Crear un módulo llamada core

	`ng g m core`

- Crea una carpeta llamada navigator junto con un componente llamado navigator y su html quitando los estilos y el archivo para pruebas

	`ng g c core/navigator -is --spec=false `
	
	`ng g c core/navigator -is --skip-tests`

- Crea un componente llamado header y su html dentro de la misma carpeta navigator

	`ng g c core/navigator/header --flat`

- Crea un modulo y html llamado home con su propio enrutamiento

	`ng g m home --routing true`

- Crea un nuevo servicio: EnvService , env.service.ts

	`ng g s env`

- Arreglar problemas de vulnerability

	`npm install -g npm@latest` 
	`npm cache clean --force`

- Audiciones de seguridad

	`npm set audit false`

- Compilar para producción

	`ng build --prod`

- Compilar para QA, es necesario agregar la configuración en angular.json y el archivo enviroment.qa.ts

	`ng build --configuration qa`

- Instalar typescript
	`npm install -g typescript`

- Version de typescript
	`tsc --version`

- Instalar ionic
	`npm install -g ionic`


## Código util ## 

- Parámetros opcionales (no pueden venir los parametros opcionales al principio)

	`ejecuta(nombre:string="Nombre por defecto", apellidos:string, edad?:number)`

- Recuperar variables de un objeto
	```
	public identity={
		id:1,
		web: 'www.hotmail.com',
		tematica:'Correo electronico'
	} 
	let {id, web}=this.identity;
	```

- Recuperar valores de un arreglo 

```
let avengers:string[] = ["uno","dos","tres"];
let [num_uno,num_dos, num_tres] = avengers;
```

- Condición if

`<div *ngIf="trabajador_externo == false"></div>`

- Evento click 

`<button (click)="cambiarExterno()">Mostrar Externo</button>`

- Condición swtich y switchCase

`<ul [ngSwitch]="color">
	<li *ngSwitchCase="'red'" `
	
- Propiedad ngStyle

`[ngStyle]="{'background':color,
			'color' : 'white',
			'padding' : '20px'
			}"> `	

- Propiedad style como atributo

`<pre [style.border]="color == 'red'?'5px solid black':'1px solid green'">`

- Propiedad class

`[class.fondoAzul]="color == 'blue'"`

- ngClass condicional

`<pre [ngClass]="{
      fondoAzul : color == 'blue',
      fondoVerde : color == 'green'
      }">`
      
- ngClass fijo en arreglo

`<pre [ngClass]="['fondoAzul','letraGrande']">`

- two way data binding

`<input type="text" [(ngModel)]="color" />`

- pipe fecha

`{{fecha | date:'dd/MM/yyyy'}}`

- pipe uppercase

`{{fecha | uppercase}}`

- Rutas de navegación

- Configurar el archivo app.routing.ts
	
	```
	import { Routes, RouterModule } from '@angular/router';

	const routes: Routes = [
	  { path: '', component: BasicosContratanteComponent }
	  ];

	@ NgModule({
	  imports: [RouterModule.forRoot(routes)],
	  exports: [RouterModule]
	})
	```
	
- Agregar esta etiqueta en el main de app.component

	`<router-outlet></router-outlet>`

- RouterLink en html

	``` 
	<li class="nav-item" routerLinkActive="active">
	   <a class="nav-link" [routerLink]="['home']">Home</a>
	</li>
	```

- Router in back file

	` this.router.navigate(['datos-inmueble']);`


**- Configuración del módulo HttpClient**

> Configurar en el archivo app.module.ts

```
 //Importar HttpClientModule
import {HttpClientModule} from '@angular/common/http';
..
imports: [
    HttpClientModule,
  ]
```
> Configurar en el servicio.ts 

```
import {HttpClient, HttpHeaders} from '@angular/common/http';

// Llamada desde el servicio
constructor(
    public http: HttpClient
){}

getProductos():Observable<any>{
	return this.http.get(this.url+'productos');
}
```

- Obtener datos desde el componente como Observable
```
getProductos(){
	this._productoService.getProductos()
	.subscribe(
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
```
- Convertir Observable en Promise
```  this.insAdds.listPaises()
.toPromise()
.then((pa: Pais[]) => {
 this.paises = [];

 pa.forEach(p =>{
   this.paises.push({label:p.descripcion,value:p.idPais + "",selected: false});
 });
})
.catch(err =>{
 console.log("Error al obtener los paises" + err);
});
```
  
- Cast result to an interface

```
studentsObservable.subscribe((studentsData: Student[]) => {
    this.students = studentsData;
});
```

### Formularios

- Form

`<form (ngSubmit)="onSubmit(userForm)" #userForm="ngForm" novalidate="">` 

- InputText

```
<label>
    Nombre
    <span *ngIf="!nombre.valid && nombre.touched" class="label label-danger">El nombre es obligatorio</span>
</label>
<input type="text" #nombre="ngModel" name="nombre" [(ngModel)]="producto.nombre" class="form-control" required />	
```

- Botón submit

`<input type="submit" value="{{titulo}}" [disabled]="!formProducto.form.valid" class="btn btn-success"/>`

- Retornar un observable de un objeto
```
	listCabecerasModalInmueble() {
	    let cabeceras = [
	      { cve_elem: "001", nom_elem: "ECONOMICO" },
	      { cve_elem: "002", nom_elem: "MEDIANO" },
	      { cve_elem: "003", nom_elem: "BUENO" },
	      { cve_elem: "004", nom_elem: "LUJO" },
	    ];

	    return new Observable(subscriber => {
	      setTimeout(() => {
		subscriber.next(cabeceras);
	      }, 1000);
	    });
	  }
```

- MAP

```
	// What you have
	var officers = [
	  { id: 20, name: 'Captain Piett' },
	  { id: 24, name: 'General Veers' },
	  { id: 56, name: 'Admiral Ozzel' },
	  { id: 88, name: 'Commander Jerjerrod' }
	];
	// What you need
	[20, 24, 56, 88]
  const officersIds = officers.map(officer => officer.id);
```

- REDUCE

```
var pilots = [
  {
    id: 10,
    name: "Poe Dameron",
    years: 14,
  },
  {
    id: 2,
    name: "Temmin 'Snap' Wexley",
    years: 30,
  }
];

const totalYears = pilots.reduce((acc, pilot) => acc + pilot.years, 0);
```

- FILTER

```
var pilots = [
  {
    id: 2,
    name: "Wedge Antilles",
    faction: "Rebels",
  },
  {
    id: 8,
    name: "Ciena Ree",
    faction: "Empire",
  }
 ]
  
const rebels = pilots.filter(pilot => pilot.faction === "Rebels");
```

- Ejemplo PIPE, MAP

```
this.api.getProducto()
      .pipe(
        map(result => {
          if (result.cveStatus != "A") {
            throw new Error('No está activo el producto');
          }
          else {
            return result;
          }
        }
        ),
        catchError(error => {
          this.logger.error("Error en consulta al Producto");
          this.logger.error(<any>error);
          this.showErrorAcceso("El producto de Casa Habitación no está activo actualmente, no es posible realizar ventas.");
          return of([]);
        })
      )
      .subscribe((result) => {
        this.logger.log("Producto");
        this.logger.log(result);
        this.productoActual = result;
        this.storage.setItem("productoActual", result);

        this.api.getTipoMoneda(result.cveMoneda)
          .subscribe(
            (moneda: TcMoneda) => {
              this.logger.log("moneda");
              this.logger.log(moneda);
              this.storage.setItem("moneda", moneda);
            },
            error => {
              this.logger.error("Error en consulta al Tipo de moneda");
              this.logger.error(<any>error);
            }
          );
      })
```
- Obtener parámetros de una url

```
  constructor(
    private activatedRoute : ActivatedRoute
  )
  ...
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log("params");
        console.log(params);
      });
```

## Enlaces externos ##

**Servicios HttpClient**

https://victorroblesweb.es/2017/11/06/httpclient-en-angular-5-ejemplos-servicios-ajax-rest/


**@ViewChild()**

https://www.concretepage.com/angular-2/angular-2-viewchild-example

**get JS file**

https://www.truecodex.com/course/angular-6/how-to-use-external-js-files-and-javascript-code-in-angular

**read enviroment files**

https://medium.com/@balramchavan/configure-and-build-angular-application-for-different-environments-7e94a3c0af23

**Local server http**

https://www.npmjs.com/package/local-web-server

**Injection dependency**

https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f

**Importar componentes dentro de módulos**

https://desarrolloweb.com/articulos/trabajar-modulos-angular.html

**Spring y Angular**

https://www.udemy.com/angular-spring/

**@Input detection**

https://ngdev.space/angular-2-input-property-changes-detection-3ccbf7e366d2

**Reusable Angular checkbox**

https://medium.com/@vladguleaev/reusable-angular-create-multiple-checkbox-group-component-84f0e4727677

**ControlValueAccesor - Agregar custom component a validaciones de Form**

http://anasfirdousi.com/how-to-make-custom-angular-components-form-enabled-ngModel-enabled.html

**Certificación en Java Developer**

https://www.develop.com.mx/java-ee7-application-developer

**Angular ng-template**

https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/

**Utilizar filter, map y reduce en Angular**

https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d

**Query params**

https://alligator.io/angular/query-parameters/

**pipe, switchMap, map**

https://www.concretepage.com/angular/angular-observable-pipe

