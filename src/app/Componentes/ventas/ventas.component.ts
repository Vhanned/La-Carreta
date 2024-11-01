// ventas.component.ts
import { Component, OnInit } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  nuevaVenta = {
    Id_Venta: '',
    fecha: '',
    dato1: '',
    dato2: '',
    dato3: '',
    descripcion: ''
  };

  ventasBD = collection(this.firebase, "Ventas");

  constructor(private firebase: Firestore, private authService: AuthService) { } // Inyecta AuthService

  ngOnInit(): void {}

  insertarVenta() {
    if (!this.nuevaVenta.fecha || !this.nuevaVenta.dato1 || !this.nuevaVenta.dato2 || !this.nuevaVenta.dato3 || !this.nuevaVenta.descripcion) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    this.nuevaVenta.Id_Venta = this.GenerateRandomString(20);
    let nuevaVentaDoc = doc(this.firebase, "Ventas", this.nuevaVenta.Id_Venta);

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
    this.nuevaVenta = {
      Id_Venta: '',
      fecha: '',
      dato1: '',
      dato2: '',
      dato3: '',
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
    this.authService.logout(); // Llama al método de logout para cerrar sesión
  }
}
