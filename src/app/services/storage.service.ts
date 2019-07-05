import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private logger : Logger
  ) { }

  setItem(name:string, value: any) {
    sessionStorage.setItem(name, JSON.stringify(value) );
  }

  getItem(name:string) {
    return JSON.parse(sessionStorage.getItem(name));
  }

  cleanItem(name:string) {
    sessionStorage.setItem(name, null);
  }

  clearAll(){
    sessionStorage.clear();
  }

}
