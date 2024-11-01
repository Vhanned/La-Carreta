import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, query, setDoc } from '@angular/fire/firestore';
import { Producto, OrdenesDeProduccion, MateriaPrima } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2'; // Importamos SweetAlert


@Component({
  selector: 'ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.css']
})
export class OrdenesProduccionComponent implements OnInit {

  cantidadesMaterias: number[] = [];
  costosMaterias: number[] = [];
  costoTotal: number = 0;

  existenciasInventario: { [nombreMateria: string]: number } = {};  // Almacena existencias por nombre de materia
  totalCantidadesMaterias: { [nombreMateria: string]: number } = {};  // Almacena total de materia prima requerida


  // Lista de ordenes de producción traida de la base de datos
  ListaOrdenes: OrdenesDeProduccion[] = [];

  // Variable para la edición de la producción
  EditarProduccionModal = new OrdenesDeProduccion();

  // Variable temporal para ver los detalles y modificar costos
  VerDetallesProduccion = new OrdenesDeProduccion();

  // Lista de los productos activos disponibles para su elaboración
  ListaProductos: Producto[] = [];
  //Lista de materias primas usadas en la fabricacion
  ListaMateriasEditar: MateriaPrima[] = [];
  MateriasBD = collection(this.firebase, "MateriasPrimas");

  // Lista de productos agregados a la orden de producción
  ProductosAgregadosOrdenProduccion = new OrdenesDeProduccion();

  OrdenProduccion = new OrdenesDeProduccion();

  // Dirección de la colección en Firestore de la que se consultan los productos
  ProductosBD = collection(this.firebase, "Productos");

  // Dirección de la colección de las órdenes de producción
  OrdenesBD = collection(this.firebase, 'OrdenesProduccion');

  constructor(private firebase: Firestore) {
    this.CargarProductos();
    this.CargarListaOrdenesProduccion();
    this.cargarInventarioMateriasPrimas();
    this.CargarListaMateriasEditar();
  }

  ngOnInit() {
    this.calcularCantidadesTotales();
  }

  CargarProductos() {
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

  CargarListaOrdenesProduccion() {
    let q = query(this.OrdenesBD);
    collectionData(q).subscribe((ordenesSnap) => {
      this.ListaOrdenes = [];  // Reiniciar la lista de órdenes
      ordenesSnap.forEach((item) => {
        let orden = new OrdenesDeProduccion();
        orden.setData(item);
        this.ListaOrdenes.push(orden);
      });
    });
  }

  CargarListaMateriasEditar() {
    let q = query(this.MateriasBD);
    collectionData(q).subscribe((materiasSnap) => {
      this.ListaMateriasEditar = [];
      materiasSnap.forEach((item) => {
        let materia = new MateriaPrima();
        materia.setData(item);
        this.ListaMateriasEditar.push(materia);
      })
    })
    console.log(this.ListaMateriasEditar)
  }

  CrearOrdenProduccion() {
    // Validar que todos los campos estén llenos
    if (!this.OrdenProduccion.Fecha_Elaboracion || !this.OrdenProduccion.Fecha_Finalizacion || !this.OrdenProduccion.Solicitante || !this.OrdenProduccion.Producto_Elaborado || !this.OrdenProduccion.Cantidad_Producto) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }
    // Guardar en Firestore
    this.OrdenProduccion.Id_Orden = this.GenerateRandomString(20);
    this.OrdenProduccion.Estado = 'Pendiente';

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
    console.log(this.ListaMateriasEditar)
  }

  EditarTablaProduccionEditar(orden: OrdenesDeProduccion) {
    for (let i = 0; i < this.ListaMateriasEditar.length; i++) {
      //this.ListaMateriasEditar.push(orden.Producto_Elaborado[i].Materias_Primas[i].Nombre)
    }
  }

  AgregarProductoProduccion(producto: Producto) {
    let ExisteProductoAgregado = this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.find(m => m.Id_Producto === producto.Id_Producto)

    if (!ExisteProductoAgregado) {
      // Agregar el producto al array de Producto_Elaborado
      this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.push(producto);
      this.OrdenProduccion.Producto_Elaborado.push(producto);
      console.log(this.ProductosAgregadosOrdenProduccion.Producto_Elaborado)
    } else {
      Swal.fire('Error', 'Este producto ya ha sido agregado.', 'error');
    }
  }

  AgregarProductoEditar(producto: Producto) {
    let ExisteProductoAgregado = this.EditarProduccionModal.Producto_Elaborado.find(m => m.Id_Producto === producto.Id_Producto)

    if (!ExisteProductoAgregado) {
      // Agregar el producto al array de Producto_Elaborado
      this.EditarProduccionModal.Producto_Elaborado.push(producto);
      this.OrdenProduccion.Producto_Elaborado.push(producto);
      console.log(this.EditarProduccionModal.Producto_Elaborado)
    } else {
      Swal.fire('Error', 'Este producto ya ha sido agregado.', 'error');
    }
  }

  EliminarProductoEditarOrden(index: number) {
    this.EditarProduccionModal.Producto_Elaborado.splice(index, 1);
    this.EditarProduccionModal.Cantidad_Producto.splice(index, 1);
    console.log(this.EditarProduccionModal.Producto_Elaborado)
  }

  EliminarProductoOrden(index: number) {
    this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.splice(index, 1);
    this.ProductosAgregadosOrdenProduccion.Cantidad_Producto.splice(index, 1);
    console.log(this.ProductosAgregadosOrdenProduccion.Producto_Elaborado)
  }

  GuardarCambiosProduccion() {
    if (!this.EditarProduccionModal.Fecha_Elaboracion || !this.EditarProduccionModal.Fecha_Finalizacion || !this.EditarProduccionModal.Solicitante || !this.EditarProduccionModal.Producto_Elaborado || !this.EditarProduccionModal.Cantidad_Producto) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }

    let productoDoc = doc(this.firebase, "OrdenesProduccion", this.EditarProduccionModal.Id_Orden);
    setDoc(productoDoc, JSON.parse(JSON.stringify(this.EditarProduccionModal)))
      .then(() => {
        Swal.fire('Éxito', 'Orden actualizada correctamente', 'success');
        this.CargarProductos(); // Refrescar lista de productos
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al actualizar la orden', 'error');
        console.error("Error actualizando orden: ", error);
      });
    let CerrarEditarModalProducto = document.getElementById("btnCerrarModalElementoEditar");
    CerrarEditarModalProducto?.click();
  }

  EliminarOrdenProduccion(orden: OrdenesDeProduccion) {
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
        const ordenRef = doc(this.firebase, 'OrdenesProduccion', orden.Id_Orden);
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
    this.VerDetallesProduccion = orden;
    console.log(orden);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  calcularCantidadMateria(producto: Producto, index: number, cantidadProducto: number): number {
    const materiaPrimaRatio = producto.Cantidad_MateriasPrimas[index] || 1; // Ajusta según tu estructura
    console.log(`Índice ${index} - Cantidad producto: ${cantidadProducto} - Cantidad de materias primas: ${materiaPrimaRatio}`);
    return cantidadProducto * materiaPrimaRatio; // Ahora utiliza la cantidad del índice específico
  }

  calcularCostoMateria(producto: Producto, index: number, cantidadProducto: number): number {
    const cantidadMateria = this.calcularCantidadMateria(producto, index, cantidadProducto);
    const costoUnitario = producto.Materias_Primas[index].Precio_unitario || 0; // Ajusta según tu estructura
    return cantidadMateria * costoUnitario; // Utiliza la cantidad de materia calculada
  }

  calcularCostoTotal(producto: Producto, cantidadProducto: number): number {
    return producto.Materias_Primas.reduce((total, _, indexMateria) => {
      return total + this.calcularCostoMateria(producto, indexMateria, cantidadProducto);
    }, 0);
  }

  calcularCantidadesTotales() {
    this.totalCantidadesMaterias = {};  // Reiniciar totales
    this.EditarProduccionModal.Producto_Elaborado.forEach((producto) => {
      producto.Materias_Primas.forEach((materia, index) => {
        const nombreMateria = materia.Nombre;
        const cantidadUsar = producto.Cantidad_MateriasPrimas[index];

        if (!this.totalCantidadesMaterias[nombreMateria]) {
          this.totalCantidadesMaterias[nombreMateria] = 0;
        }

        this.totalCantidadesMaterias[nombreMateria] += cantidadUsar;  // Sumar cantidades necesarias
      });
    });
  }

  cargarInventarioMateriasPrimas() {
    const inventarioRef = collection(this.firebase, "InventarioMateriasPrimas");
    collectionData(inventarioRef).subscribe((inventarioSnap) => {
      inventarioSnap.forEach((item: any) => {
        this.existenciasInventario[item.Nombre] = item.Existencia || 0;
      });
    });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getPrecioUnitario(materiaNombre: string): number {
    const producto = this.EditarProduccionModal?.Producto_Elaborado
      ?.find(producto => producto?.Materias_Primas?.some(m => m?.Nombre === materiaNombre));

    return producto?.Materias_Primas?.find(m => m?.Nombre === materiaNombre)?.Precio_unitario || 0;
  }

  GenerateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  resetForm() {
  }

  BuscarProduccion() {

  }
}
