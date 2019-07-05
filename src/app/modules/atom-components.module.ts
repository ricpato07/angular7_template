import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';

//components
import { ValTextoComponent } from '../components/atoms/val-texto/val-texto.component';
import { ValCodigoPostalComponent } from '../components/atoms/val-codigo-postal/val-codigo-postal.component';
import { ValRadioComponent } from '../components/atoms/val-radio/val-radio.component';
import { ModalCuentasComponent } from '../components/atoms/modal-cuentas/modal-cuentas.component';
import { ValSelectComponent } from '../components/atoms/val-select/val-select.component';
import { ValCheckboxComponent } from '../components/atoms/val-checkbox/val-checkbox.component';
import { MensajeErrorComponent } from '../components/atoms/mensaje-error/mensaje-error.component';
import { ModalRemodelacionComponent } from '../components/atoms/modal-remodelacion/modal-remodelacion.component';
import { ModalValorInmuebleComponent } from '../components/atoms/modal-valor-inmueble/modal-valor-inmueble.component';
import { ValNumeroCuentaComponent } from '../components/atoms/val-numero-cuenta/val-numero-cuenta.component';
import { ModalHtmlComponent } from '../components/atoms/modal-html/modal-html.component';
import { ModalComponent } from '../components/atoms/modal/modal.component';
import { ValComboComponent } from '../components/atoms/val-combo/val-combo.component';
import { FormaPagoComponent } from '../components/atoms/forma-pago/forma-pago.component';
import { CoberturaOpcionalComponent } from '../components/atoms/cobertura-opcional/cobertura-opcional.component';
import { ModalPdfComponent } from '../components/atoms/modal-pdf/modal-pdf.component';


@NgModule({
  declarations: [
    ValTextoComponent,
    ValNumeroCuentaComponent,
    ValCodigoPostalComponent,
    ValRadioComponent,
    ModalCuentasComponent,
    ValSelectComponent,
    ValCheckboxComponent,
    MensajeErrorComponent,
    ModalRemodelacionComponent,
    ModalValorInmuebleComponent,
    ModalHtmlComponent,
    ModalComponent,
    ValComboComponent,
    FormaPagoComponent,
    CoberturaOpcionalComponent,
    ModalPdfComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FilterPipeModule
  ],
  exports: [
    ValTextoComponent,
    ValNumeroCuentaComponent,
    ValCodigoPostalComponent,
    ValRadioComponent,
    ModalCuentasComponent,
    ValSelectComponent,
    ValCheckboxComponent,
    MensajeErrorComponent,
    ModalRemodelacionComponent,
    ModalValorInmuebleComponent,
    ModalHtmlComponent,
    ModalComponent,
    ValComboComponent,
    FormaPagoComponent,
    CoberturaOpcionalComponent,
    ModalPdfComponent
  ]
})
export class AtomComponentsModule { }
