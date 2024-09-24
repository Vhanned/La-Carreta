import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//Base de datos


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './Componentes/Login/Login';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
    //provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    //provideFirestore(()=>getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
