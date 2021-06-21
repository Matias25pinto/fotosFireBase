import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FotosComponent } from './components/fotos/fotos.component';
import { CargaComponent } from './components/carga/carga.component';

const ROUTES: Routes = [
  {path: 'fotos', component: FotosComponent},
  {path: 'carga', component: CargaComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'fotos'}
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
