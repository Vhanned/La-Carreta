import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Componentes/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.css']
})
export class FinanzasComponent implements OnInit {

  nuevoReporte = {
    Id_Reporte: '',
    fecha: '',
    mpBanco: '',
    mpCajaChica: '',
    gastosEfectivos: '',
    gastosBanco: '',
    comprasInversion: '',
    gastos: ''
  };

  finanzasBD = collection(this.firebase, "Finanzas");

  constructor(private firebase: Firestore, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Acceso Denegado', 'Debe iniciar sesión para acceder a esta página', 'error');
      this.router.navigate(['/login']);
    }
  }

  insertarReporte() {
    // Validar que todos los campos sean obligatorios
    if (!this.nuevoReporte.fecha ||
        !this.nuevoReporte.mpBanco ||
        !this.nuevoReporte.mpCajaChica ||
        !this.nuevoReporte.gastosEfectivos ||
        !this.nuevoReporte.gastosBanco ||
        !this.nuevoReporte.comprasInversion ||
        !this.nuevoReporte.gastos) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Generar un ID único para el nuevo reporte
    this.nuevoReporte.Id_Reporte = this.GenerateRandomString(20);
    const nuevoReporteDoc = doc(this.firebase, "Finanzas", this.nuevoReporte.Id_Reporte);

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
    // Restablecer el formulario a valores vacíos
    this.nuevoReporte = {
      Id_Reporte: '',
      fecha: '',
      mpBanco: '',
      mpCajaChica: '',
      gastosEfectivos: '',
      gastosBanco: '',
      comprasInversion: '',
      gastos: ''
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
    this.router.navigate(['/login']);
  }
}
