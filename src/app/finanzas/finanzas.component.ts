import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.css']
})
export class FinanzasComponent implements OnInit {

  nuevoReporte = {
    Id_Reporte: '',
    fecha: '',
    ingreso: '',
    egreso: '',
    balance: '',
    descripcion: ''
  };

  finanzasBD = collection(this.firebase, "Finanzas");

  constructor(private firebase: Firestore, private authService: AuthService) { }

  ngOnInit(): void {}

  insertarReporte() {
    // Validar que todos los campos sean obligatorios
    if (!this.nuevoReporte.fecha || !this.nuevoReporte.ingreso || !this.nuevoReporte.egreso || !this.nuevoReporte.balance) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Generar un ID único para el nuevo reporte
    this.nuevoReporte.Id_Reporte = this.GenerateRandomString(20);
    let nuevoReporteDoc = doc(this.firebase, "Finanzas", this.nuevoReporte.Id_Reporte);

    // Insertar el nuevo reporte en Firestore
    setDoc(nuevoReporteDoc, this.nuevoReporte)
      .then(() => {
        Swal.fire('Éxito', 'Reporte agregado correctamente', 'success');
        this.LimpiarFormulario();
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el reporte', 'error');
        console.error("Error guardando reporte: ", error);
      });
  }

  LimpiarFormulario() {
    // Restablecer el formulario
    this.nuevoReporte = {
      Id_Reporte: '',
      fecha: '',
      ingreso: '',
      egreso: '',
      balance: '',
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
