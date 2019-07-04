import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class PeticionesService{
public url:string;

  constructor(private _http: HttpClient){
  	this.url = "https://jsonplaceholder.typicode.com/posts";
  //https://victorroblesweb.es/2017/11/06/httpclient-en-angular-5-ejemplos-servicios-ajax-rest/
  }
  
  getPrueba(){
  	return 'Hola mundo desde el servicio.';
  }

    getArticulos(){
  	return this._http.get(this.url);
  }
}