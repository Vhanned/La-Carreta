import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, setDoc } from '@angular/fire/firestore';
import { MateriaPrima, Producto } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'inventarios-productos',
  templateUrl: './inventarios-productos.component.html',
  styleUrls: ['./inventarios-productos.component.css']
})
export class InventariosProductosComponent {

  //variable temporal para agregar un nuevo producto
  nuevoProducto = new Producto();
  //variable temporal para mostrar las materias primas disponibles
  ModalverMateriasPrimasAgregar:MateriaPrima[] = [];
  //variable para ver la informacion del producto seleccionado y editarla de ser necesario
  verDetalleProducto = new Producto();
  //
  listaMateriasPrimas: MateriaPrima[] = [];
  materiaPrimaSeleccionada: MateriaPrima | null = null;
  materiaPrimaSeleccionadaEditar: MateriaPrima | null = null;

  listaProductos: Producto[] = [];

  ProductosBD = collection(this.firebase, "Productos");
  materiasPrimasBD = collection(this.firebase, "MateriasPrimas");

  constructor(private firebase: Firestore) {
    this.cargarProductos();
    this.obtenerMateriasPrimas();
    let q = query(this.materiasPrimasBD);
    collectionData(q).subscribe((materiaPrimaSnap) => {
      this.ModalverMateriasPrimasAgregar = [];
      materiaPrimaSnap.forEach((item) => {
        let materiaPrima = new MateriaPrima();
        materiaPrima.setData(item);
        console.log(item);
        this.ModalverMateriasPrimasAgregar.push(materiaPrima);
      });
    });
  }

  cargarProductos() {
    let q = query(this.ProductosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.listaProductos = [];
      productoSnap.forEach((item) => {
        let producto = new Producto();
        producto.setData(item);
        this.listaProductos.push(producto);
      });
    });
  }

  obtenerMateriasPrimas() {
    const materiasPrimasBD = collection(this.firebase, "MateriasPrimas");
    collectionData(materiasPrimasBD, { idField: 'Id_Materia' }).subscribe((data: any) => {
      this.listaMateriasPrimas = data.map((materia: any) => {
        let materiaPrima = new MateriaPrima();
        materiaPrima.setData(materia);
        return materiaPrima;
      });
    });
  }



  insertarProducto() {
    if (!this.nuevoProducto.Codigo || !this.nuevoProducto.Nombre || !this.nuevoProducto.Elaboracion || this.nuevoProducto.Materias_Primas.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debe agregar al menos una materia prima', 'error');
      return;
    }

    this.nuevoProducto.Id_Producto = this.GenerateRandomString(20);
    let nuevaMateriaDoc = doc(this.firebase, "Productos", this.nuevoProducto.Id_Producto);

    setDoc(nuevaMateriaDoc, JSON.parse(JSON.stringify(this.nuevoProducto)))
      .then(() => {
        Swal.fire('Éxito', 'Producto agregado correctamente', 'success');
        this.nuevoProducto = new Producto(); // Limpiar formulario
        this.cargarProductos(); // Refrescar lista de productos
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el producto', 'error');
        console.error("Error guardando producto: ", error);
      });
  }

  editarDetalles() {
    if (!this.verDetalleProducto.Codigo || !this.verDetalleProducto.Nombre || !this.verDetalleProducto.Elaboracion || this.verDetalleProducto.Materias_Primas.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debe agregar al menos una materia prima', 'error');
      return;
    }

    let productoDoc = doc(this.firebase, "Productos", this.verDetalleProducto.Id_Producto);
    setDoc(productoDoc, JSON.parse(JSON.stringify(this.verDetalleProducto)))
      .then(() => {
        Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
        this.cargarProductos(); // Refrescar lista de productos
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al actualizar el producto', 'error');
        console.error("Error actualizando producto: ", error);
      });
  }

  verModalDetalles(producto: Producto) {
    this.verDetalleProducto = producto;
  }

  GenerateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
