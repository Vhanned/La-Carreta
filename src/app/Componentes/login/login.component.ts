import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/app/clases/clases.component';
import { Firestore,collection,collectionData,query,where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  Usuario ="";
  Contrasena="";
  Credencial = new Usuarios();

  UsuariosColleccion = collection(this.firestore,"Usuarios");

  constructor(private firestore:Firestore, private routing:Router) { 

  }

  InicioSesion() {
    console.log(this.Usuario)
    let q = query(this.UsuariosColleccion, where("NombreUsuario", "==", this.Usuario), where("Contrasena", "==", this.Contrasena));
    collectionData(q).pipe(take(1)).subscribe((UsuarioSnap) => {
        if (UsuarioSnap.length != 0) {
            alert("Acceso exitoso");
            this.Credencial.setData(UsuarioSnap[0]);
            this.routing.navigate(['menuprincipal'], { state: this.Credencial });
            console.log(this.Credencial);
        } else {
            alert("No se encontraron usuarios con estas credenciales");
            console.log(this.Credencial);
        }
    });
}


}
