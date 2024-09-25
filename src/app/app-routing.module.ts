import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { MenuprincipalComponent } from './Componentes/menuprincipal/menuprincipal.component';

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'menuprincipal',component:MenuprincipalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
