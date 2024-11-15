import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { SubproductosComonent } from './Componentes/Subproductos/subproductos.component';
import { InventariosComponent } from './Componentes/inventarios/inventarios.component';
import { OrdenesProduccionComponent } from './Componentes/ordenes-produccion/ordenes-produccion.component';
import { InventariosProductosComponent } from './Componentes/inventarios-productos/inventarios-productos.component';
import { AlmacenComponent } from './Componentes/almacen/almacen.component';
import { AdmContComponent } from './Componentes/adm-cont/adm-cont.component';
import { ReportesProduccionComponent } from './Componentes/reportes-produccion/reportes-produccion.component';
import { VentasComponent } from './Componentes/ventas/ventas.component';
import { AuthGuard } from './Componentes/services/au.guard';
import { RoleGuard } from './Componentes/services/role.guard';
import { FinanzasComponent } from './Componentes/finanzas/finanzas.component';

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'login',component:LoginComponent},
{path:'subproductos',component:SubproductosComonent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' }},
{path: 'inventarios',component:InventariosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' }},
{path: 'ordenes-produccion', component:OrdenesProduccionComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' }},
{path: 'inventarios-productos', component:InventariosProductosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' }},
{path: 'c',component:AlmacenComponent},
{path: 'adcont', component:AdmContComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Ad-Cont' }},
{path: 'reportes-produccion', component:ReportesProduccionComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' }},
{path: 'ventas', component:VentasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Ventas' }},
{path: 'finanzas', component:FinanzasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Finanzas' }},
{ path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
