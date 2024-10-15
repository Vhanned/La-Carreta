import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, setDoc } from '@angular/fire/firestore';
import { Producto } from 'src/app/clases/clases.component';

@Component({
  selector: 'inventarios-productos',
  templateUrl: './inventarios-productos.component.html',
  styleUrls: ['./inventarios-productos.component.css']
})
export class InventariosProductosComponent {

  //Agregar producto al inventario
  nuevoProducto = new Producto();
  verDetalleProducto = new Producto();

  //Lista de productos
  listaProductos: Producto[] = new Array();

  //Direccion en donde se guardan los productos en firebase
  ProductosBD = collection(this.firebase, "Productos");

  constructor(private firebase: Firestore) {

    let q = query(this.ProductosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.listaProductos = new Array();
      productoSnap.forEach((item) => {
        let materiaPrima = new Producto();
        materiaPrima.setData(item);
        console.log(item);
        this.listaProductos.push(materiaPrima);
      });
    });


  }

  insertarProducto() {

    this.nuevoProducto.Id_Producto = this.GenerateRandomString(20); // Generar un ID único para la nueva materia
    let nuevaMateriaDoc = doc(this.firebase, "Productos", this.nuevoProducto.Id_Producto);

    // Guardar la nueva materia en Firestore
    setDoc(nuevaMateriaDoc, JSON.parse(JSON.stringify(this.nuevoProducto)))
      .then(() => {
        alert("Producto agregado exitosamente");
        this.limpiarFormulario();
      })
      .catch((error) => {
        console.error("Error al agregar el producto: ", error);
      });

    let btnCerrar = document.getElementById('btnCerrarModalElemento');
    btnCerrar?.click();

  }


  GenerateRandomString(num: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  limpiarFormulario() {
    this.nuevoProducto = new Producto(); // Resetea la nueva materia
  }


  // Método para seleccionar una materia prima para edición
  verModalDetalles(producto: Producto) {
    this.verDetalleProducto = producto;
  }

  // Método para editar una materia prima existente
  editarDetalles() {

    // Actualizar los datos de la materia en Firestore
    let detalleDoc = doc(this.firebase, "MateriasPrimas", this.verDetalleProducto.Id_Producto);
    setDoc(detalleDoc, JSON.parse(JSON.stringify(this.verDetalleProducto)))
      .then(() => {
        alert("Informacion actualizada exitosamente");
      })
      .catch((error) => {
        console.error("Error al actualizar la informacion: ", error);
      });

    let btnCerrarEditar = document.getElementById('btnCerrarEditarElemento');
    btnCerrarEditar?.click();
  }

}
