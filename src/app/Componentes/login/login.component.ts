import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/app/clases/clases.component';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  Usuario = "";
  Contrasena = "";
  Credencial = new Usuarios();

  UsuariosColleccion = collection(this.firestore, "Usuarios");

  constructor(private firestore: Firestore, private routing: Router, private authService: AuthService) {}

  InicioSesion() {
    console.log(this.Usuario);

    // Verificar si es un usuario de Ventas
    if (this.Usuario === "Ventas" && this.Contrasena === "ventas") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sesión Iniciada",
        showConfirmButton: false,
        timer: 800
      });
      this.authService.login('Ventas'); // Establece el rol como 'Ventas'
      this.routing.navigate(['ventas']);
      return;
    }

    // Verificar si es un usuario de Producción
    if (this.Usuario === "Produccion" && this.Contrasena === "produccion") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sesión Iniciada",
        showConfirmButton: false,
        timer: 800
      });
      this.authService.login('Producción'); // Establece el rol como 'Producción'
      this.routing.navigate(['ordenes-produccion']);
      return;
    }

    // Validación de otros usuarios desde la colección en Firestore
    let q = query(this.UsuariosColleccion, where("NombreUsuario", "==", this.Usuario), where("Contrasena", "==", this.Contrasena));
    collectionData(q).pipe(take(1)).subscribe((UsuarioSnap) => {
      if (UsuarioSnap.length != 0) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Sesión Iniciada",
          showConfirmButton: false,
          timer: 800
        });
        // Asignar el rol del usuario desde la base de datos o la lógica de tu aplicación
        const userRole = UsuarioSnap[0].role || 'Usuario'; // Asegúrate de que el rol esté almacenado en la base de datos
        this.authService.login(userRole); // Establece el rol desde la base de datos
        this.Credencial.setData(UsuarioSnap[0]);

        // Redirigir según el rol
        if (userRole === 'Ventas') {
          this.routing.navigate(['ventas']);
        } else if (userRole === 'Producción') {
          this.routing.navigate(['ordenes-produccion']);
        } else {
          this.routing.navigate(['dashboard']); // Ruta por defecto para otros roles
        }
        console.log(this.Credencial);
      } else {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Usuario o Contraseña Incorrecta",
          showConfirmButton: false,
          timer: 900
        });
        console.log(this.Credencial);
      }
    });
  }
}
