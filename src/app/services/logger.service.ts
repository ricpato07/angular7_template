import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class Logger {
bndProduction : boolean;

  constructor() {
    this.bndProduction = environment.production
   }

  log(mensaje){
    if(!this.bndProduction){
      console.log(mensaje);
    }
  }

  error(mensaje){
    if(!this.bndProduction){
      console.error(mensaje);
    }
  }

  warn(mensaje){
    if(!this.bndProduction){
      console.warn(mensaje);
    }
  }

}
