import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


// Base de datos
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Componentes/login/login.component';

import { environment } from '../environments/environment';
import { SubproductosComonent } from './Componentes/Subproductos/subproductos.component';
import { NavBarComponent } from './Componentes/nav-bar/nav-bar.component';
import { InventariosComponent } from './Componentes/inventarios/inventarios.component';
import { OrdenesProduccionComponent } from './Componentes/ordenes-produccion/ordenes-produccion.component';
import { InventariosProductosComponent } from './Componentes/inventarios-productos/inventarios-productos.component';
import { AlmacenComponent } from './Componentes/almacen/almacen.component';
import { AdmContComponent } from './Componentes/adm-cont/adm-cont.component';
import { VentasComponent } from './Componentes/ventas/ventas.component';
import { ProductosTerminadosComponent } from './Componentes/productos-terminados/productos-terminados.component';
import { FinanzasComponent } from './Componentes/finanzas/finanzas.component';
import { CEOComponent } from './Componentes/ceo/ceo.component';
import { RegistrosComponent } from './Componentes/registros/registros.component';
import { TruncatePipe } from './Pipe/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SubproductosComonent,
    NavBarComponent,
    InventariosComponent,
    OrdenesProduccionComponent,
    InventariosProductosComponent,
    AlmacenComponent,
    AdmContComponent,
    VentasComponent,
    FinanzasComponent,
    ProductosTerminadosComponent,
    CEOComponent,
    RegistrosComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
