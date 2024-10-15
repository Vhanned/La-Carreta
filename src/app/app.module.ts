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
import { MenuprincipalComponent } from './Componentes/menuprincipal/menuprincipal.component';
import { NavBarComponent } from './Componentes/nav-bar/nav-bar.component';
import { InventariosComponent } from './Componentes/inventarios/inventarios.component';
import { OrdenesProduccionComponent } from './Componentes/ordenes-produccion/ordenes-produccion.component';
import { InventariosProductosComponent } from './Componentes/inventarios-productos/inventarios-productos.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { AdmContComponent } from './adm-cont/adm-cont.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProduccionComponent } from './produccion/produccion.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuprincipalComponent,
    NavBarComponent,
    InventariosComponent,
    OrdenesProduccionComponent,
    InventariosProductosComponent,
    AlmacenComponent,
    AdmContComponent,
    VentasComponent,
    ProduccionComponent
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
