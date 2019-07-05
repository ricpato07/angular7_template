import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicosContratanteComponent } from './components/basicos-contratante/basicos-contratante.component';
import { DatosInmuebleComponent } from './components/datos-inmueble/datos-inmueble.component';
import { CotizacionComponent } from './components/cotizacion/cotizacion.component';

const routes: Routes = [
  { path: '', component: BasicosContratanteComponent },
  { path: 'basicos-contratante', component: BasicosContratanteComponent },
  { path: 'datos-inmueble', component: DatosInmuebleComponent },
  { path: 'cotizacion', component: CotizacionComponent },
  {path: '**', component: BasicosContratanteComponent}
];

export const AppRoutingModule : ModuleWithProviders = RouterModule.forRoot(routes, {useHash : true})

