import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Componentes/services/auth.service';

@Component({
  selector: 'app-adm-cont',
  templateUrl: './adm-cont.component.html',
  styleUrls: ['./adm-cont.component.css']
})
export class AdmContComponent implements OnInit {

  nuevoRegistro = {
    Id_Registro: '',
    fecha: '',
    cuenta: '',
    monto: '',
    tipo: '',
    descripcion: ''
  };

  adContBD = collection(this.firebase, "AdCont");

  constructor(private firebase: Firestore, private authService: AuthService) { }

  ngOnInit(): void {}

  insertarRegistro() {
    // Validar que todos los campos sean obligatorios
    if (!this.nuevoRegistro.fecha || !this.nuevoRegistro.cuenta || !this.nuevoRegistro.monto || !this.nuevoRegistro.tipo) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Generar un ID único para el nuevo registro
    this.nuevoRegistro.Id_Registro = this.GenerateRandomString(20);
    let nuevoRegistroDoc = doc(this.firebase, "AdCont", this.nuevoRegistro.Id_Registro);

    // Insertar el nuevo registro en Firestore
    setDoc(nuevoRegistroDoc, this.nuevoRegistro)
      .then(() => {
        Swal.fire('Éxito', 'Registro agregado correctamente', 'success');
        this.LimpiarFormulario();
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el registro', 'error');
        console.error("Error guardando registro: ", error);
      });
  }

  LimpiarFormulario() {
    // Restablecer el formulario
    this.nuevoRegistro = {
      Id_Registro: '',
      fecha: '',
      cuenta: '',
      monto: '',
      tipo: '',
      descripcion: ''
    };
  }

  GenerateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  cerrarSesion() {
    this.authService.logout(); // Cerrar sesión
  }
}

