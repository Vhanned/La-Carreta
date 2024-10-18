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

  //Agregar producto al inventario
  nuevoProducto = new Producto();
  verDetalleProducto = new Producto();
  listaMateriasPrimas: MateriaPrima[] = [];
  materiaPrimaSeleccionada: MateriaPrima | null = null;  // Materia prima seleccionada en el menu desplegable
  cantidadSeleccionada: number | null = null;  // Cantidad de materia prima seleccionada


  //Lista de productos
  listaProductos: Producto[] = [];

  

  //Direccion en donde se guardan los productos en firebase
  ProductosBD = collection(this.firebase, "Productos");

  constructor(private firebase: Firestore) {
    let q = query(this.ProductosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.listaProductos = [];
      productoSnap.forEach((item) => {
        let producto = new Producto();
        producto.setData(item);
        console.log(item);
        this.listaProductos.push(producto);
      });
    });

    this.obtenerMateriasPrimas();
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

  

  agregarMateriaPrima() {
    //Verifica si hay una materia seleccionada en el menu
    if (this.materiaPrimaSeleccionada) {
      //Inserta la materia seleccionada en el arreglo de materias dentro de la clase producto
      this.nuevoProducto.Materias_Primas.push(this.materiaPrimaSeleccionada);
      //Agrega una cantidad por defecto para poder modificarse
      this.nuevoProducto.Cantidad_MateriasPrimas.push(0);
      //Elimina posibilidad de seleccionar la materia prima del menu desplegable
      this.listaMateriasPrimas = this.listaMateriasPrimas.filter(materia => materia !== this.materiaPrimaSeleccionada);

      this.materiaPrimaSeleccionada = null; // Resetear la selección
    }
  }
  

  eliminarMateriaPrima(index: number) {
    // Elimina la materia prima del arreglo
    const materiaEliminada = this.verDetalleProducto.Materias_Primas.splice(index, 1)[0];

    // Elimina la cantidad correspondiente
    this.verDetalleProducto.Cantidad_MateriasPrimas.splice(index, 1);

    // Vuelve a añadir la materia prima a la lista de materias primas disponibles
    this.listaMateriasPrimas.push(materiaEliminada);
}


  insertarProducto() {

    if(!this.nuevoProducto.Codigo || !this.nuevoProducto.Nombre || !this.nuevoProducto.Elaboracion ){
      if (this.nuevoProducto.Materias_Primas.length > 0) {
        this.nuevoProducto.Id_Producto = this.GenerateRandomString(20); // Generar un ID único
        let nuevaMateriaDoc = doc(this.firebase, "Productos", this.nuevoProducto.Id_Producto);
    
        // Guardar el nuevo producto en Firestore
        setDoc(nuevaMateriaDoc, JSON.parse(JSON.stringify(this.nuevoProducto)))
          .then(() => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Producto agregado exitosamente",
              showConfirmButton: false,
              timer: 1000
            });
            this.limpiarFormulario();
            this.closeModal(); // Llamar a la función para cerrar el modal
          })
          .catch((error) => {
            console.error("Error al agregar el producto: ", error);
          });
      } else {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Por favor, agregue al menos una materia prima antes de guardar el producto.",
          showConfirmButton: false,
          timer: 1700
        });
      }
    }
  }
  
  closeModal() {
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
    this.nuevoProducto = new Producto(); // Resetea el nuevo producto
  }

  verModalDetalles(producto: Producto) {
    this.verDetalleProducto = producto;
  }

  editarDetalles() {
    let detalleDoc = doc(this.firebase, "Productos", this.verDetalleProducto.Id_Producto);
    setDoc(detalleDoc, JSON.parse(JSON.stringify(this.verDetalleProducto)))
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Información actualizada exitosamente",
          showConfirmButton: false,
          timer: 1000
        });
      })
      .catch((error) => {
        console.error("Error al actualizar la información: ", error);
      });

    let btnCerrarEditar = document.getElementById('btnCerrarEditarElemento');
    btnCerrarEditar?.click();
  }
}
