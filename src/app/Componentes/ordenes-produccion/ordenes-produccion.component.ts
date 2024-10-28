import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, query, setDoc } from '@angular/fire/firestore';
import { Producto, OrdenesDeProduccion } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2'; // Importamos SweetAlert


@Component({
  selector: 'ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.css']
})
export class OrdenesProduccionComponent {

  //Lista de ordenes de producccion traida de la base de datos
  ListaOrdenes: OrdenesDeProduccion[]=[];

  //Variable para la edicion de la produccion
  EditarProduccionModal = new OrdenesDeProduccion();

  //Lista de los productos activos disponibles para su elaboracion
  ListaProductos: Producto[] = [];

  //Lista de productos agregados a la orden de produccion
  ProductosAgregadosOrdenProduccion = new OrdenesDeProduccion();

  OrdenProduccion = new OrdenesDeProduccion();


  //Direccion de la coleccion en firestore de la que se consultan los productos
  ProductosBD = collection(this.firebase, "Productos");

  //Direccion de la coleccion de las ordenes de produccion
  OrdenesBD = collection(this.firebase, 'OrdenesProduccion');

  constructor(private firebase: Firestore) {

    this.CargarProductos();
    this.CargarListaOrdenesProduccion();
    

  }

  CargarProductos(){
    let q = query(this.ProductosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.ListaProductos = [];  // Reiniciar la lista de productos
      productoSnap.forEach((item) => {
        let producto = new Producto();
        producto.setData(item);

        // Verificar si el producto está en estado "Activo"
        if (producto.Estado === "Activo") {

          // Asegurar que la cantidad de materias primas esté correctamente inicializada
          if (!producto.Cantidad_MateriasPrimas || producto.Cantidad_MateriasPrimas.length !== producto.Materias_Primas.length) {
            producto.Cantidad_MateriasPrimas = Array(producto.Materias_Primas.length).fill(0);
          }

          // Agregar el producto a la lista si está activo
          this.ListaProductos.push(producto);
        }
      });
    });
  }

  CargarListaOrdenesProduccion(){
    let q = query(this.OrdenesBD);
    collectionData(q).subscribe((ordenesSnap) => {
      this.ListaOrdenes = [];  // Reiniciar la lista de ordenes
      ordenesSnap.forEach((item) => {
        let orden = new OrdenesDeProduccion();
        orden.setData(item);
        this.ListaOrdenes.push(orden);
      });
    });
  }

  CrearOrdenProduccion() {
    //Validar que todos los campos esten llenos
    if (!this.OrdenProduccion.Fecha_Elaboracion || !this.OrdenProduccion.Fecha_Finalizacion || !this.OrdenProduccion.Usuario_Elabroacion ||!this.OrdenProduccion.Producto_Elaborado ) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }
    // Guardar en Firestore
    this.OrdenProduccion.Id_Orden = this.GenerateRandomString(20);

    let NuevaOrdenDoc = doc(this.firebase, "OrdenesProduccion", this.OrdenProduccion.Id_Orden);

    setDoc(NuevaOrdenDoc, JSON.parse(JSON.stringify(this.OrdenProduccion)))
      .then(() => {
        Swal.fire('Éxito', 'Orden creada correctamente', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el producto', 'error');
        console.error("Error guardando producto: ", error);
      });
    console.log(this.OrdenProduccion)
    
    let btnCerrar = document.getElementById('btnCerrarModalCrear');
    btnCerrar?.click();
  }


  EditarOrdenProduccion(orden: OrdenesDeProduccion) {
    this.EditarProduccionModal = orden;
    console.log(this.EditarProduccionModal)
  }

  AgregarProductoProduccion(producto: Producto) {
    let ExisteProductoAgregado = this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.find(m => m.Id_Producto === producto.Id_Producto)

    if (!ExisteProductoAgregado) {
      // Agregar la materia prima al array de producto en Recetas
      this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.push(producto);
      this.OrdenProduccion.Producto_Elaborado.push(producto);
      //this.OrdenProduccion.Cantidad_Producto.push()
      console.log(this.ProductosAgregadosOrdenProduccion.Producto_Elaborado)
    } else {
      Swal.fire('Error', 'Este producto ya ha sido agregado.', 'error');
    }
  }

  EliminarProductoOrden(index:number) {
    // Eliminar el elemento de Producto_Elaborado usando el índice
    this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.splice(index, 1);

    // También eliminar la cantidad correspondiente del array Cantidad_Producto
    this.ProductosAgregadosOrdenProduccion.Cantidad_Producto.splice(index, 1);
    console.log(this.ProductosAgregadosOrdenProduccion.Producto_Elaborado)
  }

  GuardarCambios() {

  }

  EliminarOrdenProduccion(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const ordenRef = doc(this.firebase, 'ordenes', id);
        deleteDoc(ordenRef)
          .then(() => {
            Swal.fire(
              'Eliminada',
              'La orden ha sido eliminada.',
              'success'
            );
          })
          .catch((error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la orden.',
              'error'
            );
          });
      }
    });
  }

  MostrarDetalles(orden: OrdenesDeProduccion) {

  }

  resetForm() {

  }

  closeModal() {
    const btnCerrar = document.getElementById('btnCerrarModalElemento');
    btnCerrar?.click();
  }

  BuscarProduccion() {

  }

  validarNombre(event: KeyboardEvent) {
    const pattern = /[a-zA-Z\s]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Prevenir la entrada de caracteres inválidos
    }
  }

  convertToComparableDate(dateString: string): Date | null {
    const [day, month, year] = dateString.split('/').map(Number);
    return !isNaN(day) && !isNaN(month) && !isNaN(year) ? new Date(year, month - 1, day) : null;
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }

  formatDateForStorage(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  RestablecerListaCompleta() {

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

}
