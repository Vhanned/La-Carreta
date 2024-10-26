import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto, Receta } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2'; // Importamos SweetAlert

interface OrdenProduccion {
  id: string;
  fechaInicio: string;
  fechaFin?: string;  // Fecha de finalización opcional
  cantidad: number;
  descripcion: string;
  responsable: string;
  status?: string;
  fechaCreacion?: string;  // Fecha de creación opcional
}

@Component({
  selector: 'ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.css']
})
export class OrdenesProduccionComponent implements OnInit {
  ordenes: Observable<OrdenProduccion[]>;  // Observable de órdenes filtradas o no
  ordenesOriginales: OrdenProduccion[] = [];  // Lista original de órdenes para poder restaurar
  fechaInicio: string = '';
  fechaFin: string = '';  // Fecha de finalización
  cantidad: number = 0;
  descripcion: string = '';
  responsable: string = '';
  selectedOrden: OrdenProduccion | null = null;
  creatingNew: boolean = true;

  //Lista de los productos activos
  ListaProductos: Producto[] = [];

  //Lista de productos agregados a la orden de produccion
  ProductosOrdenProduccion: Receta[]=[];

  ProductosBD = collection(this.firebase, "Productos");

  constructor(private firebase: Firestore) {
    const ordenesCollection = collection(this.firebase, 'ordenes');
    this.ordenes = collectionData(ordenesCollection, { idField: 'id' }) as Observable<OrdenProduccion[]>;

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

  ngOnInit(): void {
    this.ordenes.subscribe((data: OrdenProduccion[]) => {
      this.ordenesOriginales = data;  // Guardamos la lista original de órdenes
      console.log('Fetched Orders:', data);
    });

  }

  CrearOrdenProduccion() {
    const nuevaOrden: OrdenProduccion = {
      id: '', // Firestore generará el ID
      fechaInicio: this.fechaInicio ? this.formatDateForStorage(this.fechaInicio) : '', // Corregir formato de fecha
      fechaFin: this.fechaFin ? this.formatDateForStorage(this.fechaFin) : '', // Corregir formato de fecha
      cantidad: this.cantidad,
      descripcion: this.descripcion,
      responsable: this.responsable,
      status: 'Pending',
      fechaCreacion: new Date().toISOString()  // Guardamos la fecha de creación actual
    };

    const ordenesCollection = collection(this.firebase, 'ordenes');
    addDoc(ordenesCollection, nuevaOrden)
      .then(() => {
        console.log("Orden creada correctamente:", nuevaOrden);
        this.resetForm();
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al crear la orden:', error);
      });
  }

  EditarOrdenProduccion(orden: OrdenProduccion) {
    this.selectedOrden = orden;
    this.creatingNew = false;
    this.fechaInicio = this.formatDateForDisplay(orden.fechaInicio);
    this.fechaFin = orden.fechaFin ? this.formatDateForDisplay(orden.fechaFin) : '';  // Asegurar que la fecha final esté presente si existe
    this.cantidad = orden.cantidad;
    this.descripcion = orden.descripcion;
    this.responsable = orden.responsable;
  }

  AgregarProductoProduccion(producto: Producto) {

  }

  EliminarProductoOrden(elemento:any){

  }

  GuardarCambios() {
    if (this.selectedOrden) {
      const ordenRef = doc(this.firebase, 'ordenes', this.selectedOrden.id);
      updateDoc(ordenRef, {
        fechaInicio: this.formatDateForStorage(this.fechaInicio),
        fechaFin: this.fechaFin ? this.formatDateForStorage(this.fechaFin) : '',
        cantidad: this.cantidad,
        descripcion: this.descripcion,
        responsable: this.responsable
      })
        .then(() => {
          this.resetForm();
          this.closeModal();
        })
        .catch((error) => {
          console.error('Error al actualizar la orden: ', error);
        });
    }
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

  MostrarDetalles(orden: OrdenProduccion) {
    const formattedDate = orden.fechaInicio ? this.formatDateForDisplay(orden.fechaInicio) : "Fecha no disponible";
    Swal.fire({
      title: 'Detalles de la Orden',
      html: `<b>Fecha de Inicio:</b> ${formattedDate}<br>
             <b>Cantidad:</b> ${orden.cantidad}<br>
             <b>Descripción:</b> ${orden.descripcion}<br>
             <b>Responsable:</b> ${orden.responsable}`,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  resetForm() {
    this.fechaInicio = '';
    this.fechaFin = '';  // Restablecemos también la fecha de finalización
    this.cantidad = 0;
    this.descripcion = '';
    this.responsable = '';
    this.selectedOrden = null;
    this.creatingNew = true;
  }

  closeModal() {
    const btnCerrar = document.getElementById('btnCerrarModalElemento');
    btnCerrar?.click();
  }

  BuscarProduccion() {
    const startDateInput = (document.getElementById('start') as HTMLInputElement).value;
    const endDateInput = (document.getElementById('end') as HTMLInputElement).value;

    if (!startDateInput || !endDateInput) {
      // Si no se seleccionan fechas, mostramos todas las órdenes
      this.RestablecerListaCompleta();
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
    endDate.setHours(23, 59, 59, 999); // Incluimos todo el día de la fecha final

    // Filtramos por la fecha de creación que esté dentro del rango
    const filteredOrders = this.ordenesOriginales.filter(order => {
      const creationDate = new Date(order.fechaCreacion!);
      return creationDate >= startDate && creationDate <= endDate;
    });

    console.log('Órdenes filtradas:', filteredOrders);

    // Actualizamos el observable con las órdenes filtradas
    this.ordenes = new Observable<OrdenProduccion[]>(subscriber => {
      subscriber.next(filteredOrders);
      subscriber.complete();
    });
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
    this.ordenes = new Observable<OrdenProduccion[]>(subscriber => {
      subscriber.next(this.ordenesOriginales);
      subscriber.complete();
    });
  }
}
