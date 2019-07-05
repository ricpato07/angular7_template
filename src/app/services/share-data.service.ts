import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { TcMoneda } from '../models/database/TcMoneda';
import { StorageService } from './storage.service';
import { HbctTeCasaHabi } from '../models/database/HbctTeCasaHabi';
import { Cuentas } from '../models/atoms/Cuentas';
import { Inmueble } from '../models/atoms/Inmueble';
import { DatosEjecutivo } from '../models/atoms/DatosEjecutivo';
/**
 * Servicio para pasar contenido entre componentes
 */
@Injectable({
  providedIn: 'root'
})

export class ShareDataService {

  constructor(
    private logger : Logger,
    private storage: StorageService
  ) {
    
  }

  setPerfilCliente(perfil : any){
    this.storage.setItem("PerfilCliente",perfil);
  }
  getPerfilCliente(): any{
    return this.storage.getItem("PerfilCliente");
  }

  setProducto(producto : any){
    this.storage.setItem("Producto",producto);
  }
  getProducto(): any{
    return this.storage.getItem("Producto");
  }

  setMoneda(moneda : any){
    this.storage.setItem("Moneda",moneda);
  }
  getMoneda(): any{
    return this.storage.getItem("Moneda");
  }

  setBndPagaRenta(bnd : boolean){
    this.storage.setItem("BndPagaRenta",bnd);
  }
  getBndPagaRenta(): boolean{
    return this.storage.getItem("BndPagaRenta");
  }

  setBack(back : boolean){
    this.storage.setItem("Back",back);
  }
  getBack(): boolean{
    return this.storage.getItem("Back");
  }

  setBasicos(basicos : HbctTeCasaHabi){
    this.storage.setItem("Basicos",basicos);
  }
  getBasicos(): HbctTeCasaHabi{
    return this.storage.getItem("Basicos");
  }

  setCodigoPostal(basicos : HbctTeCasaHabi){
    this.storage.setItem("CodigoPostal",basicos);
  }
  getCodigoPostal(): HbctTeCasaHabi{
    return this.storage.getItem("CodigoPostal");
  }

  setCuentasAlternativas(cuentas : Cuentas){
    this.storage.setItem("CuentasAlternativas",cuentas);
  }
  getCuentasAlternativas(): Cuentas{
    return this.storage.getItem("CuentasAlternativas");
  }

  setTiposRemodelacion(tipos : string[]){
    this.storage.setItem("TiposRemodelacion",tipos);
  }
  getTiposRemodelacion(): string[]{
    return this.storage.getItem("TiposRemodelacion");
  }

  setInmuebleModal(inmueble : Inmueble){
    this.storage.setItem("InmuebleModal",inmueble);
  }
  getInmuebleModal(): Inmueble{
    return this.storage.getItem("InmuebleModal");
  }

  setDatosEjecutivo(datos : DatosEjecutivo){
    this.storage.setItem("DatosEjecutivo",datos);
  }
  getDatosEjecutivo(): DatosEjecutivo{
    return this.storage.getItem("DatosEjecutivo");
  }

  setMedidasSeguridad(datos : string[]){
    this.storage.setItem("MedidasSeguridad",datos);
  }
  getMedidasSeguridad(): string[]{
    return this.storage.getItem("MedidasSeguridad");
  }

  setNuevaCotizacion(value : boolean){
    this.storage.setItem("BndNuevaCotizacion",value);
  }
  getNuevaCotizacion(): boolean{
    return this.storage.getItem("BndNuevaCotizacion");
  }


  cleanItem(value: string){
    this.storage.cleanItem(value);
  }

  clearAll(){
    this.storage.clearAll();
  }

}
