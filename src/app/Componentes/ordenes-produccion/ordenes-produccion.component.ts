import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface OrdenProduccion {
  id: string;
  fechaInicio: string;
  cantidad: number; 
  descripcion: string;
  responsable: string;
  status?: string;
}

@Component({
  selector: 'ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.css']
})
export class OrdenesProduccionComponent implements OnInit {
  ordenes: Observable<OrdenProduccion[]>;
  fechaInicio: string = '';
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
        console.log('Fetched Orders:', data);
        if (data.length === 0) {
            console.warn("No orders found. Ensure data is correctly saved to Firestore.");
        }
    });
}




CrearOrdenProduccion() {
  const nuevaOrden: OrdenProduccion = {
      id: '', // Firestore auto-generará el ID
      fechaInicio: this.fechaInicio ? new Date(this.fechaInicio).toISOString() : '', // Asegúrate de que la fecha esté en el formato correcto
      cantidad: this.cantidad,
      descripcion: this.descripcion,
      responsable: this.responsable,
      status: 'Pending'
  };

  console.log("Creating order with data:", nuevaOrden); // Log para verificar los datos

  const ordenesCollection = collection(this.firebase, 'ordenes');
  addDoc(ordenesCollection, nuevaOrden)
      .then(() => {
          console.log("Order created successfully:", nuevaOrden);
          this.resetForm();
          this.closeModal();
      })
      .catch((error) => {
          console.error('Error creating order:', error);
      });
}







  EditarOrdenProduccion(orden: OrdenProduccion) {
    this.selectedOrden = orden;
    this.creatingNew = false;
    this.fechaInicio = orden.fechaInicio;
    this.cantidad = orden.cantidad;
    this.descripcion = orden.descripcion;
    this.responsable = orden.responsable;
  }

  GuardarCambios() {
    if (this.selectedOrden) {
      const ordenRef = doc(this.firebase, 'ordenes', this.selectedOrden.id);
      updateDoc(ordenRef, {
        fechaInicio: this.fechaInicio,
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
    const formattedDate = orden.fechaInicio ? new Date(orden.fechaInicio).toLocaleDateString() : "Fecha no disponible";
    alert(`Detalles:
      - Fecha de Inicio: ${formattedDate}
      - Cantidad: ${orden.cantidad}
      - Descripción: ${orden.descripcion}
      - Responsable: ${orden.responsable}`);
  }
  
  
  

  resetForm() {
    this.fechaInicio = '';
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

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    // Ensure valid dates are entered
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('Please enter valid start and end dates.');
        return;
    }

    // Fetch and filter the data based on date range
    this.ordenes.subscribe((data: OrdenProduccion[]) => {
        const filteredOrders = data.filter(order => {
            const orderDate = order.fechaInicio ? new Date(order.fechaInicio) : null;
            return orderDate && orderDate >= startDate && orderDate <= endDate;
        });

        console.log('Filtered Orders:', filteredOrders);

        // Update the table display based on the filtered results
        this.showFilteredOrders(filteredOrders);
    });
}

showFilteredOrders(orders: OrdenProduccion[]) {
  const tbody = document.querySelector('tbody');
  if (tbody) {
      tbody.innerHTML = ''; // Clear existing rows
      if (orders.length === 0) {
          // Show a message if no orders are found
          const tr = document.createElement('tr');
          tr.innerHTML = `<td colspan="6" class="text-center">No se encontraron órdenes para el rango de fechas seleccionado.</td>`;
          tbody.appendChild(tr);
      } else {
          // Populate table with filtered results
          orders.forEach(order => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                  <td>${order.fechaInicio ? new Date(order.fechaInicio).toLocaleDateString() : 'Sin fecha'}</td>
                  <td>${order.cantidad}</td>
                  <td>${order.descripcion || 'Sin descripción'}</td>
                  <td>${order.responsable || 'Sin responsable'}</td>
                  <td>
                      <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" (click)="EditarOrdenProduccion(order)">Editar</button>
                      <button class="btn btn-danger btn-sm" (click)="EliminarOrdenProduccion(order.id)">Eliminar</button>
                      <button class="btn btn-info btn-sm" (click)="MostrarDetalles(order)">Detalles</button>
                  </td>`;
              tbody.appendChild(tr);
          });
      }
  }
}


  
}


