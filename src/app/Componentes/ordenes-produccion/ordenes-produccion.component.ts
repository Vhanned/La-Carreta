import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  constructor(private firebase: Firestore) {
    const ordenesCollection = collection(this.firebase, 'ordenes');
    this.ordenes = collectionData(ordenesCollection, { idField: 'id' }) as Observable<OrdenProduccion[]>;
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
      fechaInicio: this.formatDateForStorage(this.fechaInicio),
      fechaFin: this.fechaFin ? this.formatDateForStorage(this.fechaFin) : '',  // Fecha de finalización
      cantidad: this.cantidad,
      descripcion: this.descripcion,
      responsable: this.responsable,
      status: 'Pending',
      fechaCreacion: new Date().toISOString()  // Guardamos la fecha de creación
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
    const ordenRef = doc(this.firebase, 'ordenes', id);
    deleteDoc(ordenRef)
      .then(() => {
        console.log('Orden eliminada con éxito');
      })
      .catch((error) => {
        console.error('Error al eliminar la orden: ', error);
      });
  }

  MostrarDetalles(orden: OrdenProduccion) {
    this.selectedOrden = orden;
    const formattedDate = orden.fechaInicio ? this.formatDateForDisplay(orden.fechaInicio) : "Fecha no disponible";
    alert(`Detalles:
      - Fecha de Inicio: ${formattedDate}
      - Cantidad: ${orden.cantidad}
      - Descripción: ${orden.descripcion}
      - Responsable: ${orden.responsable}`);
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
  
    const startDate = this.convertToComparableDate(startDateInput);
    const endDate = this.convertToComparableDate(endDateInput);
  
    if (!startDate || !endDate) {
      console.warn('Por favor ingresa fechas válidas.');
      return;
    }
  
    const filteredOrders = this.ordenesOriginales.filter(order => {
      const orderDate = this.convertToComparableDate(order.fechaInicio);
      
      // Verificamos si `orderDate` no es nulo antes de hacer la comparación
      return orderDate && orderDate >= startDate && orderDate <= endDate;
    });
  
    console.log('Órdenes filtradas:', filteredOrders);
  
    // Actualizamos el observable con las órdenes filtradas
    this.ordenes = new Observable<OrdenProduccion[]>(subscriber => {
      subscriber.next(filteredOrders);
      subscriber.complete();
    });
  }

  convertToComparableDate(dateString: string): Date | null {
    // Cambiamos el formato de la fecha de dd/MM/yyyy a un objeto Date
    const [day, month, year] = dateString.split('/').map(Number);
    return !isNaN(day) && !isNaN(month) && !isNaN(year) ? new Date(year, month - 1, day) : null;
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }

  formatDateForStorage(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  RestablecerListaCompleta() {
    this.ordenes = new Observable<OrdenProduccion[]>(subscriber => {
      subscriber.next(this.ordenesOriginales);
      subscriber.complete();
    });
  }
}
