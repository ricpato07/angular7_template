import { Component, OnInit } from '@angular/core';
import { HbctTcCasaHabi } from '../../models/database/HbctTcCasaHabi';
import { Logger } from '../../services/logger.service';
import { StorageService } from '../../services/storage.service';
import { DataRestService } from '../../services/data-rest.service';
import { Opcion } from '../../models/atoms/Opcion';
import { Router } from '@angular/router';
import { Constants } from '../../globals/constants';
import { CheckboxItem } from '../../models/atoms/CheckboxItem';
import { MensajeError } from '../../models/atoms/MensajeError';


@Component({
  selector: 'app-datos-inmueble',
  templateUrl: './datos-inmueble.component.html'
})
export class DatosInmuebleComponent implements OnInit {
  basicos: HbctTcCasaHabi;
  paiseslist: Opcion[];
  medidasSeguridadlist: CheckboxItem[];
  mensajeError: MensajeError;
  moneda_pattern;

  constructor(
    private logger: Logger,
    private storage: StorageService,
    private insAdds: DataRestService,
    private router: Router
  ) {
    this.storage.setItem("HbctTcCasahabi", {});
    //this.basicos = this.storage.getItem("HbctTcCasahabi");
    this.basicos = {};
    this.moneda_pattern = Constants.MONEDA_PATTERN;
    this.medidasSeguridadlist = [
      new CheckboxItem(1, "VIGILANCIA 24 HORAS", false),
      new CheckboxItem(2, "ALARMA", false)
    ];
  }

  ngOnInit() {
    this.loadPaises();
    this.showError();
  }

  loadPaises() {

    //  this.insAdds.listPaises()
    //     .toPromise()
    //     .then((pa: Pais[]) => {
    //       this.paises = [];

    //       pa.forEach(p =>{
    //         this.paises.push({label:p.descripcion,value:p.idPais + "",selected: false});
    //       });
    //     })
    //     .catch(err =>{
    //       console.log("Error al obtener los paises" + err);
    //     });


    this.insAdds.listPaises()
      .subscribe(
        result => {
          this.paiseslist = [];
          result.forEach(item => {
            this.paiseslist.push(
              {
                label: item.descripcion,
                value: item.idPais,
                selected: false
              });
          });
        },
        error => {
          this.logger.error("Error en consulta a paises");
          this.logger.error(<any>error);
        }
      );
  }

  medidasSelected(value) {

    this.basicos.cveSisSeg1 = null;
    this.basicos.cveSisSeg2 = null;
    this.basicos.cveSisSeg3 = null;
    this.basicos.cveSisSeg4 = null;
    this.basicos.cveSisSeg5 = null;

    if (value.length > 0) {
      value.forEach(item => {
        switch (item) {
          case 1: this.basicos.cveSisSeg1 = item;
            break;
          case 2: this.basicos.cveSisSeg2 = item;
            break;
          case 3: this.basicos.cveSisSeg3 = item;
            break;
          case 4: this.basicos.cveSisSeg4 = item;
            break;
          case 5: this.basicos.cveSisSeg5 = item;
            break;
        }
      })
    }

  }

  regresar() {
    this.router.navigate(['basicos-contratante']);
  }

  continuar() {
    this.logger.log(this.basicos);
    //this.router.navigate(['datos-inmueble']);
  }

  showError() {
    this.mensajeError = new MensajeError("Error formulario:",
      "La cuenta de cheques fue cambiada vuelva a cotizar...",
      true
    );
  }
}
