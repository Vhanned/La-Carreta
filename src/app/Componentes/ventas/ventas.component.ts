import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Componentes/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  nuevaVenta = {
    Id_Venta: '',
    fecha: '',
    cobranzaEfectivo: '',
    cobranzaBanco: '',
    compraProductos: '',
    inventario: '',
    ventaContado: '',
    cuentasCobrar: ''
  };

  ventasBD = collection(this.firebase, "Ventas");

  constructor(private firebase: Firestore, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Acceso Denegado', 'Debe iniciar sesión para acceder a esta página', 'error');
      this.router.navigate(['/login']);
    }
  }

  insertarVenta() {
    // Validar que todos los campos sean obligatorios
    if (!this.nuevaVenta.fecha ||
        !this.nuevaVenta.cobranzaEfectivo ||
        !this.nuevaVenta.cobranzaBanco ||
        !this.nuevaVenta.compraProductos ||
        !this.nuevaVenta.inventario ||
        !this.nuevaVenta.ventaContado ||
        !this.nuevaVenta.cuentasCobrar) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Generar un ID único para la nueva venta
    this.nuevaVenta.Id_Venta = this.GenerateRandomString(20);
    const nuevaVentaDoc = doc(this.firebase, "Ventas", this.nuevaVenta.Id_Venta);

    // Insertar la nueva venta en Firestore
    setDoc(nuevaVentaDoc, this.nuevaVenta)
      .then(() => {
        Swal.fire('Éxito', 'Venta agregada correctamente', 'success');
        this.LimpiarFormulario();
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar la venta', 'error');
        console.error("Error guardando venta: ", error);
      });
  }

  LimpiarFormulario() {
    // Restablecer el formulario a valores vacíos
    this.nuevaVenta = {
      Id_Venta: '',
      fecha: '',
      cobranzaEfectivo: '',
      cobranzaBanco: '',
      compraProductos: '',
      inventario: '',
      ventaContado: '',
      cuentasCobrar: ''
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
