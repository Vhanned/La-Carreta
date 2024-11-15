import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Componentes/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-cont',
  templateUrl: './adm-cont.component.html',
  styleUrls: ['./adm-cont.component.css']
})
export class AdmContComponent implements OnInit {

  nuevoRegistro = {
    Id_Registro: '',
    fecha: '',
    pagoProveedoresEfectivo: '',
    pagoProveedoresCreditoBanco: '',
    pagoProveedoresBanco: '',
    cuentasPorPagar: '',
    gastosGenerales: '',
    otrosGastos: '',
    anticipoProveedor: '',
    pagoProveedoresCreditoEfectivo: ''
  };

  adContBD = collection(this.firebase, "AdCont");

  constructor(private firebase: Firestore, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Verificar autenticación al iniciar
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Acceso Denegado', 'Debe iniciar sesión para acceder a esta página', 'error');
      this.router.navigate(['/login']);
    }
  }

  insertarRegistro() {
    // Validar que todos los campos sean obligatorios
    if (!this.nuevoRegistro.fecha ||
        !this.nuevoRegistro.pagoProveedoresEfectivo ||
        !this.nuevoRegistro.pagoProveedoresCreditoBanco ||
        !this.nuevoRegistro.pagoProveedoresBanco ||
        !this.nuevoRegistro.cuentasPorPagar ||
        !this.nuevoRegistro.gastosGenerales ||
        !this.nuevoRegistro.otrosGastos ||
        !this.nuevoRegistro.anticipoProveedor ||
        !this.nuevoRegistro.pagoProveedoresCreditoEfectivo) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Generar un ID único para el nuevo registro
    this.nuevoRegistro.Id_Registro = this.GenerateRandomString(20);
    const nuevoRegistroDoc = doc(this.firebase, "AdCont", this.nuevoRegistro.Id_Registro);

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
    // Restablecer el formulario a valores vacíos
    this.nuevoRegistro = {
      Id_Registro: '',
      fecha: '',
      pagoProveedoresEfectivo: '',
      pagoProveedoresCreditoBanco: '',
      pagoProveedoresBanco: '',
      cuentasPorPagar: '',
      gastosGenerales: '',
      otrosGastos: '',
      anticipoProveedor: '',
      pagoProveedoresCreditoEfectivo: ''
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
