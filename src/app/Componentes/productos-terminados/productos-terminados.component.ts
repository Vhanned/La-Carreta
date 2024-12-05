import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { doc, getDoc, increment, setDoc, updateDoc, where } from 'firebase/firestore';
import { InventarioProductos, MateriaPrima, SalidaProducto } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'productos-terminados',
  templateUrl: './productos-terminados.component.html',
  styleUrls: ['./productos-terminados.component.css']
})
export class ProductosTerminadosComponent implements OnInit {

//Lista de productos terminados
InvetarioTerminados:InventarioProductos[]=[];

NuevaVenta = new InventarioProductos();
RegistroSalida = new SalidaProducto();

//Coleccion de productos terminados
ProductosTerminadosBD = collection(this.firebase,"ProductosTerminados")

CantidadVenta:number=0;

  constructor(private firebase:Firestore) { 
    this.CargarProductosTerminados();
  }

  ngOnInit(): void {
  }

  CargarProductosTerminados(){
    let q = query(this.ProductosTerminadosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.InvetarioTerminados = [];  // Reiniciar la lista de productos
      productoSnap.forEach((item) => {
        let producto = new InventarioProductos();
        producto.setData(item);
        this.InvetarioTerminados.push(producto)
      });
    });
  }

  ModificarPrecio(Producto:InventarioProductos){
    updateDoc(doc(this.firebase,"ProductosTerminados",Producto.Id_producto),{Precio:Producto.Precio});
    Swal.fire({
      title: "Operacion exitosa",
      text: "Precio actualizado correctamente",
      icon: "success"
    });
  }

  SalidaDeProducto(NuevaVenta: InventarioProductos) {
    // Consulta Firestore para obtener la cantidad actual del producto
    const productoRef = doc(this.firebase, "ProductosTerminados", NuevaVenta.Id_producto);
  
    getDoc(productoRef).then((productoSnap) => {
      if (productoSnap.exists()) {
        const productoData = productoSnap.data();
        const cantidadDisponible = productoData?.Cantidad || 0;
  
        // Validar si hay suficiente cantidad
        if (this.CantidadVenta > cantidadDisponible) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "No hay suficiente cantidad disponible para completar la venta.",
            showConfirmButton: true,
          });
          return; // Detener el proceso si no hay suficiente cantidad
        }
  
        // Si la cantidad es suficiente, proceder con la actualización y registro
        updateDoc(productoRef, { Cantidad: increment(-this.CantidadVenta) });
  
        this.RegistroSalida.Id_ProductoSalida = NuevaVenta.Id_producto;
        this.RegistroSalida.CantidadSalida = this.CantidadVenta;
        this.RegistroSalida.Id_RegistroSalida = this.GenerateRandomString(20);
        this.RegistroSalida.Precio = NuevaVenta.Precio;
        this.RegistroSalida.ProductoSalida = NuevaVenta.Nombre_Producto;
        this.RegistroSalida.FechaSalida = new Date().toISOString().split("T")[0];
  
        setDoc(doc(this.firebase, "SalidaProducto", this.GenerateRandomString(20)), JSON.parse(JSON.stringify(this.RegistroSalida)));
  
        let BtnCerrar = document.getElementById("btnCerrarModalElemento");
        BtnCerrar?.click();
  
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Venta registrada correctamente.",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "El producto no existe en el inventario.",
          showConfirmButton: true,
        });
      }
    }).catch((error) => {
      console.error("Error al verificar la cantidad del producto:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Hubo un error al verificar el inventario.",
        showConfirmButton: true,
      });
    });
  }
  

  CargarInfo(Producto:InventarioProductos){
    this.NuevaVenta = Producto;
  }

  GenerateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validarTecla(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

}
