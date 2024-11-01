import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, query, setDoc } from '@angular/fire/firestore';
import { Producto, OrdenesDeProduccion } from 'src/app/clases/clases.component';
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

  // Lista de ordenes de producción traida de la base de datos
  ListaOrdenes: OrdenesDeProduccion[] = [];
  ListaOrdenesOriginales: OrdenesDeProduccion[] = []; // Lista original de órdenes

  // Variable para la edición de la producción
  EditarProduccionModal = new OrdenesDeProduccion();

  // Variable temporal para ver los detalles y modificar costos
  VerDetallesProduccion = new OrdenesDeProduccion();

  // Lista de los productos activos disponibles para su elaboración
  ListaProductos: Producto[] = [];

  // Lista de productos agregados a la orden de producción
  ProductosAgregadosOrdenProduccion = new OrdenesDeProduccion();

  OrdenProduccion = new OrdenesDeProduccion();

  // Dirección de la colección en Firestore de la que se consultan los productos
  ProductosBD = collection(this.firebase, "Productos");

  // Dirección de la colección de las órdenes de producción
  OrdenesBD = collection(this.firebase, 'OrdenesProduccion');

  // Variables para almacenar las fechas de búsqueda
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private firebase: Firestore) {
    this.CargarProductos();
    this.CargarListaOrdenesProduccion();
  }

  ngOnInit() {
    console.log('Valor inicial de VerDetallesProduccion.Cantidad_Producto[0]:', this.VerDetallesProduccion.Cantidad_Producto[0]);
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
          if (!producto.Cantidad_MateriasPrimas || producto.Cantidad_MateriasPrimas.length !== producto.Materias_Primas.length) {
            producto.Cantidad_MateriasPrimas = Array(producto.Materias_Primas.length).fill(0);
          }
          this.ListaProductos.push(producto);
        }
      });
    });
  }

  CargarListaOrdenesProduccion() {
    let q = query(this.OrdenesBD);
    collectionData(q).subscribe((ordenesSnap) => {
      this.ListaOrdenes = [];
      this.ListaOrdenesOriginales = []; // Guardamos la lista original
      ordenesSnap.forEach((item) => {
        let orden = new OrdenesDeProduccion();
        orden.setData(item);
  
        // Asegurarse de que Fecha_Creacion esté definida
        if (!orden.Fecha_Creacion) {
          orden.Fecha_Creacion = new Date().toISOString().split('T')[0];
        }
  
        this.ListaOrdenes.push(orden);
        this.ListaOrdenesOriginales.push(orden); // Almacenar en la lista original
      });
    });
  }

  FiltrarOrdenesPorFecha(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999); // Incluye el último segundo del día final

    console.log("Fecha de inicio (formateada):", inicio);
    console.log("Fecha de fin (formateada):", fin);

    // Filtra las órdenes de producción en base a la lista original
    this.ListaOrdenes = this.ListaOrdenesOriginales.filter(orden => {
      if (!orden.Fecha_Creacion) {
        console.log("Orden sin fecha de creación:", orden);
        return false; // Excluye órdenes sin `Fecha_Creacion`
      }

      const fechaCreacion = new Date(orden.Fecha_Creacion);
      const isWithinRange = fechaCreacion >= inicio && fechaCreacion <= fin;
      console.log("Fecha de creación de la orden (formateada):", fechaCreacion);
      console.log("¿Está dentro del rango?", isWithinRange);
      return isWithinRange;
    });

    console.log("Lista de órdenes filtrada:", this.ListaOrdenes);
  }

  CrearOrdenProduccion() {
    this.OrdenProduccion.Fecha_Creacion = new Date().toISOString().split('T')[0];

    if (!this.OrdenProduccion.Fecha_Elaboracion || !this.OrdenProduccion.Fecha_Finalizacion || 
        !this.OrdenProduccion.Solicitante || !this.OrdenProduccion.Producto_Elaborado || 
        !this.OrdenProduccion.Cantidad_Producto) {
        Swal.fire('Error', 'Complete todos los campos', 'error');
        return;
    }

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
      this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.push(producto);
      this.OrdenProduccion.Producto_Elaborado.push(producto);
      console.log(this.ProductosAgregadosOrdenProduccion.Producto_Elaborado)
    } else {
      Swal.fire('Error', 'Este producto ya ha sido agregado.', 'error');
    }
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
        this.CargarProductos();
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
    const materiaPrimaRatio = producto.Cantidad_MateriasPrimas[index] || 1;
    console.log(`Índice ${index} - Cantidad producto: ${cantidadProducto} - Cantidad de materias primas: ${materiaPrimaRatio}`);
    return cantidadProducto * materiaPrimaRatio;
  }

  calcularCostoMateria(producto: Producto, index: number, cantidadProducto: number): number {
    const cantidadMateria = this.calcularCantidadMateria(producto, index, cantidadProducto);
    const costoUnitario = producto.Materias_Primas[index].Precio_unitario || 0;
    return cantidadMateria * costoUnitario;
  }

  calcularCostoTotal(producto: Producto, cantidadProducto: number): number {
    return producto.Materias_Primas.reduce((total, _, indexMateria) => {
      return total + this.calcularCostoMateria(producto, indexMateria, cantidadProducto);
    }, 0);
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
    this.OrdenProduccion = new OrdenesDeProduccion();
  }

  RestablecerListaCompleta() {
    this.ListaOrdenes = [...this.ListaOrdenesOriginales];
  }

  BuscarProduccion() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.RestablecerListaCompleta();
    } else {
      this.FiltrarOrdenesPorFecha(this.fechaInicio, this.fechaFin);
    }
  }
}
