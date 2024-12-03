import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, setDoc } from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';
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
  ModalverMateriasPrimasAgregar: MateriaPrima[] = [];
  //variable para ver la informacion del producto seleccionado y editarla de ser necesario
  verDetalleProducto = new Producto();
  //Lista de materias disponibles
  listaMateriasPrimas: MateriaPrima[] = [];

  materiasFiltradas: MateriaPrima[] = []; // Lista para almacenar el resultado del filtro

  //Materias primas agregadas que se mostraran en en la tabla de agregados del modal
  MateriasPrimasAgregadas: MateriaPrima[] = [];

  listaProductos: Producto[] = [];

  searchText:string='';

  ProductosBD = collection(this.firebase, "Productos");
  materiasPrimasBD = collection(this.firebase, "MateriasPrimas");

  constructor(private firebase: Firestore) {
    
    this.cargarProductos();
    this.CargarMateriasModal();
  }

  cargarProductos() {
    let q = query(this.ProductosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.listaProductos = [];
      productoSnap.forEach((item) => {
        let producto = new Producto();
        producto.setData(item);

        // Asegurar que la cantidad de materias primas esté correctamente inicializada
        if (!producto.Cantidad_MateriasPrimas || producto.Cantidad_MateriasPrimas.length !== producto.Materias_Primas.length) {
          producto.Cantidad_MateriasPrimas = Array(producto.Materias_Primas.length).fill(0);
        }

        this.listaProductos.push(producto);
      });
    });
  }


 

  CargarMateriasModal(){
    let q = query(this.materiasPrimasBD,orderBy('Codigo','asc'));
    collectionData(q).subscribe((materiaPrimaSnap) => {
      this.ModalverMateriasPrimasAgregar = [];
      materiaPrimaSnap.forEach((item) => {
        let materiaPrima = new MateriaPrima();
        materiaPrima.setData(item);
        this.ModalverMateriasPrimasAgregar.push(materiaPrima);
      });
      this.filtrarMaterias();
    });
  }

  AgregarMateriaProducto(materia: MateriaPrima) {
    // Verifica si la materia prima ya ha sido agregada al producto
    let existeMateria = this.nuevoProducto.Materias_Primas.find(m => m.Id_Materia === materia.Id_Materia);

    if (!existeMateria) {
      // Agregar la materia prima al array Materias_Primas
      this.nuevoProducto.Materias_Primas.push(materia);

      // Asegurar que también agregamos una cantidad predeterminada en Cantidad_MateriasPrimas
    } else {
      Swal.fire('Error', 'Esta materia prima ya ha sido agregada.', 'error');
    }
  }


  AgregarMateriaEditarProducto(materia: MateriaPrima) {
    // Verifica si la materia prima ya ha sido agregada al producto
    let existeMateria = this.verDetalleProducto.Materias_Primas.find(m => m.Id_Materia === materia.Id_Materia);

    if (!existeMateria) {
      // Agregar la materia prima al array Materias_Primas
      this.verDetalleProducto.Materias_Primas.push(materia);

      // Asegurar que también agregamos una cantidad predeterminada en Cantidad_MateriasPrimas
      this.verDetalleProducto.Cantidad_MateriasPrimas.push(0);  // Inicializar la cantidad en 0
    } else {
      Swal.fire('Error', 'Esta materia prima ya ha sido agregada.', 'error');
    }
  }

  LimpiarFormulario() {
    this.nuevoProducto = new Producto();
    this.MateriasPrimasAgregadas = [];
  }

  EliminarMateriaProducto(index: number) {
    // Eliminar el elemento de Materias_Primas usando el índice
    this.nuevoProducto.Materias_Primas.splice(index, 1);

    // También eliminar la cantidad correspondiente del array Cantidad_MateriasPrimas
    this.nuevoProducto.Cantidad_MateriasPrimas.splice(index, 1);
  }

  EliminarMateriaEditarProducto(index: number) {
    // Eliminar el elemento de Materias_Primas usando el índice
    this.verDetalleProducto.Materias_Primas.splice(index, 1);

    // También eliminar la cantidad correspondiente del array Cantidad_MateriasPrimas
    this.verDetalleProducto.Cantidad_MateriasPrimas.splice(index, 1);
  }


  insertarProducto() {
    //Verifica que todos los campos sean llenados antes de proceder
    if (!this.nuevoProducto.Codigo || !this.nuevoProducto.Nombre || !this.nuevoProducto.Elaboracion || this.nuevoProducto.Materias_Primas.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debe agregar al menos una materia prima', 'error');
      return;
    }

    this.nuevoProducto.Id_Producto = this.GenerateRandomString(20);
    let nuevaMateriaDoc = doc(this.firebase, "Productos", this.nuevoProducto.Id_Producto);

    setDoc(nuevaMateriaDoc, JSON.parse(JSON.stringify(this.nuevoProducto)))
      .then(() => {
        Swal.fire('Éxito', 'Producto agregado correctamente', 'success');
        this.LimpiarFormulario(); // Limpiar formulario
        this.cargarProductos(); // Refrescar lista de productos
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el producto', 'error');
        console.error("Error guardando producto: ", error);
      });

    let btnCerrar = document.getElementById("CerrarAgregarProducto");
    btnCerrar?.click()
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
    let CerrarEditarModalProducto = document.getElementById("CerrarEditarProducto");
    CerrarEditarModalProducto?.click();
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

  trackByIndex(index: number, item: any): number {
    return index;
  }

  filtrarMaterias() {
    this.materiasFiltradas = this.ModalverMateriasPrimasAgregar.filter(materia =>
      materia.Nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
      materia.Codigo.toLowerCase().includes(this.searchText.toLowerCase()) ||
      materia.Marca.toLowerCase().includes(this.searchText.toLowerCase()) ||
      materia.Tipo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
