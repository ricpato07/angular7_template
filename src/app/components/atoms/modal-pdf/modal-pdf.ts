import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { Logger } from '../../../services/logger.service';
import { DataRestService } from '../../../services/data-rest.service';
import { ValidacionesService } from '../../../services/validaciones.service';
import { Tooltip } from '../../../models/atoms/Tooltip';

@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html'
})
export class ModalPdfComponent implements OnInit {
  dataLocalUrl: SafeHtml;
  bndGenerated: boolean;
  bndObject: boolean;
  objectHtml: SafeHtml;
  showModalInfo : boolean;
  tooltip: Tooltip;

  @Input() show: boolean;
  @Input() numCotiza: Number;
  @Output() showChange: EventEmitter<boolean>;

  constructor(
    private logger: Logger,
    private api: DataRestService,
    private val: ValidacionesService,
    protected sanitizer: DomSanitizer
  ) {
    this.showChange = new EventEmitter();
    this.show = false;
    this.dataLocalUrl = null;
    this.tooltip = new Tooltip(null, null, null);
  }

  ngOnInit() {
    let showMensaje = false;
    this.logger.log("ModalPdfComponent ngOnInit");
    this.logger.log("numCotiza:" + this.numCotiza);
    this.bndObject = this.val.getBrowser() == "ie" ? false : true;

    if (!this.val.isEmpty(this.numCotiza)) {
      this.api.getPDFCotizacion(this.numCotiza.toString())
        .subscribe((file: ArrayBuffer) => {
          var blob = new Blob([new Uint8Array(file)]);
          this.dataLocalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

          this.showInfo(`Se ha guardado la cotización número <strong>${this.numCotiza}</strong>. Si tu cliente decide contratar el seguro en otra ocasión. Puedes continuar con el proceso de venta ingresando al menú: SERVICIOS, opción LISTA DE COTIZACIONES`);
        });
    }

  }

  close() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  /* Show info ************************************************************/

  showInfo(texto : string) {
    this.logger.log("showInfo");
    this.tooltip = new Tooltip(null, "Cotización generada", null);
    this.tooltip.html = texto;
    this.showModalInfo = true;
  }

  cerrarModalTooltip(event: boolean) {
    this.showModalInfo = event;
  }

  /*****************************************************************/

}
