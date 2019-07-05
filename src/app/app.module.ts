import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { HttpClientModule } from '@angular/common/http';

// proyecto principal
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';

//modules
import { AtomComponentsModule } from './modules/atom-components.module';

//principal components
import { BasicosContratanteComponent } from './components/basicos-contratante/basicos-contratante.component';
import { DatosInmuebleComponent } from './components/datos-inmueble/datos-inmueble.component';
import { CotizacionComponent } from './components/cotizacion/cotizacion.component';


@NgModule({
  declarations: [
    AppComponent,
    BasicosContratanteComponent,
    DatosInmuebleComponent,
    CotizacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FilterPipeModule,
    HttpClientModule,
    AtomComponentsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
