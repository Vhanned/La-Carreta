import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { MenuprincipalComponent } from './Componentes/menuprincipal/menuprincipal.component';
import { InventariosComponent } from './Componentes/inventarios/inventarios.component';

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'login',component:LoginComponent},
{path:'menuprincipal',component:MenuprincipalComponent},
{path: 'inventarios',component:InventariosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
