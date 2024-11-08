import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { SubproductosComonent } from './Componentes/Subproductos/subproductos.component';
import { InventariosComponent } from './Componentes/inventarios/inventarios.component';
import { OrdenesProduccionComponent } from './Componentes/ordenes-produccion/ordenes-produccion.component';
import { InventariosProductosComponent } from './Componentes/inventarios-productos/inventarios-productos.component';
import { AlmacenComponent } from './Componentes/almacen/almacen.component';
import { AdmContComponent } from './Componentes/adm-cont/adm-cont.component';
import { ProduccionComponent } from './Componentes/produccion-reportes/produccion.component';
import { VentasComponent } from './Componentes/ventas/ventas.component';

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'login',component:LoginComponent},
{path:'subproductos',component:SubproductosComonent},
{path: 'inventarios',component:InventariosComponent},
{path: 'ordenes-produccion', component:OrdenesProduccionComponent},
{path: 'inventarios-productos', component:InventariosProductosComponent},
{path: 'c',component:AlmacenComponent},
{path: 's', component:AdmContComponent},
{path: 'reportes-produccion', component:ProduccionComponent},
{path: 'ventas', component:VentasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
