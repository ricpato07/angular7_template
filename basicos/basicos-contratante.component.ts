import { Component, OnInit, ViewChild } from '@angular/core';
import { HbctTcCasaHabi } from './../../models/HbctTcCasaHabi';
//import { ValTextoComponent } from '../atoms/val-texto/val-texto.component';
import { environment } from '../../../environments/environment';
import { NOMBRE_PATTERN, INTEGER_PATTERN, NUM_CASA_PATTERN } from '../../constants/constants';
import { Opcion } from '../../models/Opcion';
import { Logger } from '../../services/logger.service';
import { StorageService } from '../../services/storage.service';
import { Cuentas } from '../../models/Cuentas';
import { ModalCuentasComponent } from '../atoms/modal-cuentas/modal-cuentas.component';
import { ShareDataService } from '../../services/share-data.service';


@Component({
  selector: 'app-basicos-contratante',
  templateUrl: './basicos-contratante.component.html'
})
export class BasicosContratanteComponent implements OnInit {
basicos: HbctTcCasaHabi;
name_pattern;
integer_pattern;
num_casa_pattern;
showModal : boolean;
tituloModal: string; 
opcionesTitular: Opcion[];
opcionesPagaRenta: Opcion[];
nomEstado: string;
nomCiudad: string;
bndPagaRenta : number;
cuentasAlternativas : Cuentas;
@ViewChild('modal_cuentas') modalCuentas: ModalCuentasComponent;

  constructor(
    private logger : Logger,
    private share : ShareDataService,
    private storage : StorageService
  ) {
    this.basicos = {};
    this.name_pattern = NOMBRE_PATTERN;
    this.integer_pattern = INTEGER_PATTERN;
    this.num_casa_pattern = NUM_CASA_PATTERN;
    this.opcionesTitular = [{label:"Si",value:"1", selected:true},
                            {label:"No",value:"0", selected:false},
                            ];
    this.bndPagaRenta = 0;
    this.opcionesPagaRenta = [{label:"Si",value:"1", selected:false},
                              {label:"No",value:"0", selected:true},
                              ];
   }

  ngOnInit() {
    this.logger.log("(ngOnInit) BasicosContratanteComponent");        
    this.storage.clearAll();
  }

  mostrarModal(){
    // this.cuentasAlternativas = this.share.getCuentas();
    //this.cuentasAlternativas = this.localStorage.getItem("cuentas");
    this.logger.log("Mostrar modal");        
    this.logger.log(this.cuentasAlternativas);        
    this.showModal = true;
    this.modalCuentas.getCuentasShare();
  }

  addCuentas(res : boolean){
    this.showModal= false;
    this.logger.log("addCuentas");        
    this.logger.log("res:"+res);
    // this.cuentasAlternativas = this.share.getCuentas();
    this.cuentasAlternativas = this.storage.getItem("cuentas");   
    this.logger.log(this.cuentasAlternativas);
    if(res){
    }
  }

  continuar(){
    this.logger.log(this.basicos);
    
  }

}
