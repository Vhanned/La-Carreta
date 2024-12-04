import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { SubproductosComonent } from './Componentes/Subproductos/subproductos.component';
import { InventariosComponent } from './Componentes/inventarios/inventarios.component';
import { OrdenesProduccionComponent } from './Componentes/ordenes-produccion/ordenes-produccion.component';
import { InventariosProductosComponent } from './Componentes/inventarios-productos/inventarios-productos.component';
import { AlmacenComponent } from './Componentes/almacen/almacen.component';
import { AdmContComponent } from './Componentes/adm-cont/adm-cont.component';
import { VentasComponent } from './Componentes/ventas/ventas.component';
import { AuthGuard } from './Componentes/services/au.guard';
import { RoleGuard } from './Componentes/services/role.guard';
import { FinanzasComponent } from './Componentes/finanzas/finanzas.component';
import { ProductosTerminadosComponent } from './Componentes/productos-terminados/productos-terminados.component';
import { CEOComponent } from './Componentes/ceo/ceo.component';
import { RegistrosComponent } from './Componentes/registros/registros.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'subproductos', component: SubproductosComonent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' } },
  { path: 'inventarios', component: InventariosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' } },
  { path: 'ordenes-produccion', component: OrdenesProduccionComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' } },
  { path: 'inventarios-productos', component: InventariosProductosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' } },
  { path: 'registros', component: RegistrosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' } },
  { path: 'productos-terminados', component: ProductosTerminadosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Producción' } },
  { path: 'adcont', component: AdmContComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Ad-Cont' } },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Ventas' } },
  { path: 'finanzas', component: FinanzasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Finanzas' } },
  { path: 'ceo', component: CEOComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'CEO' } },
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
