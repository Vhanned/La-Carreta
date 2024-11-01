import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, query, setDoc } from '@angular/fire/firestore';
import { where } from 'firebase/firestore';
import { find } from 'rxjs/operators';
import { Producto, OrdenesDeProduccion, MateriaPrima, MateriaPrimaInfo, InventarioMateriasPrimas, MateriaPrimaInfoClase } from 'src/app/clases/clases.component';
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
  //Lista de materias primas usadas en la fabricacion
  ListaMateriasEditar:MateriaPrimaInfo[]=[];
  ListaTemporalMaterias:MateriaPrimaInfoClase[]=[]
  MateriasBD = collection(this.firebase, "MateriasPrimas");

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
    console.log(this.ListaMateriasEditar)
  }

  EditarTablaProduccionEditar(orden: OrdenesDeProduccion) {
    this.ListaMateriasEditar=[];
    for (let index = 0; index < orden.Producto_Elaborado.length; index++) {
      let cantidadProducto = orden.Cantidad_Producto[index];
  
      for (let j = 0; j < orden.Producto_Elaborado[index].Materias_Primas.length; j++) {
        let materia = orden.Producto_Elaborado[index].Materias_Primas[j];
        let cantidadMateria = orden.Producto_Elaborado[index].Cantidad_MateriasPrimas[j];
        let cantidadTotalMateria = cantidadMateria * cantidadProducto;
  
        // Revisa si ya existe en el arreglo acumulado
        let materiaExistente = this.ListaMateriasEditar.find(m => m.id === materia.Id_Materia);
  
        if (materiaExistente) {
          // Si ya existe, suma la cantidad
          materiaExistente.cantidadausar += cantidadTotalMateria;
        } else {
          // Si no existe, crea una nueva entrada
          this.ListaMateriasEditar.push({
            id: materia.Id_Materia,
            nombre: materia.Nombre,
            cantidadausar: cantidadTotalMateria,
            precio: 0,         // Temporal, se actualizará con el valor de Firestore
            existencias: 0     // Temporal, se actualizará con el valor de Firestore
          });
        }
      }
    }
    console.log(this.ListaMateriasEditar);
    // Una vez que tienes todas las materias acumuladas, haces la consulta a Firestore:
    this.actualizarDatosFirestore(this.ListaMateriasEditar);
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

  async actualizarDatosFirestoreTodos(materias: MateriaPrimaInfo[]) {
    const materiaIds = materias.map(m => m.id);
    try {
      const snapshot = await this.firebase.firestore().collection('Materias_Primas').where('id', 'in', materiaIds).get();
  
      snapshot.forEach(doc => {
        const data = doc.data();
        const materia = materias.find(m => m.id === doc.id);
        if (materia) {
          materia.precio = data.Precio_unitario;
          materia.existencias = data.Existencia;
        }
      });
      console.log("Datos de materias actualizados con una sola consulta.");
    } catch (error) {
      console.error("Error obteniendo datos de Firestore:", error);
    }
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
