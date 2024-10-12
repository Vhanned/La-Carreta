import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface OrdenProduccion {
  id: string;
  fechaInicio: string;
  cantidad: number;
  descripcion: string;
  responsable: string;
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

  constructor(private firebase: Firestore) {
    const ordenesCollection = collection(this.firebase, 'ordenes');
    this.ordenes = collectionData(ordenesCollection, { idField: 'id' }) as Observable<OrdenProduccion[]>;
  }

  ngOnInit(): void {}

  CrearOrdenProduccion() {
    const nuevaOrden: OrdenProduccion = {
      id: '', // ID será generado automáticamente por Firebase
      fechaInicio: this.fechaInicio,
      cantidad: this.cantidad,
      descripcion: this.descripcion,
      responsable: this.responsable
    };

    const ordenesCollection = collection(this.firebase, 'ordenes');
    addDoc(ordenesCollection, nuevaOrden)
      .then(() => {
        // Limpiar los campos del formulario después de guardar
        this.fechaInicio = '';
        this.cantidad = 0;
        this.descripcion = '';
        this.responsable = '';

        // Cerrar el modal después de crear la orden
        let btnCerrar = document.getElementById('btnCerrarModalElemento');
        btnCerrar?.click();
      })
      .catch((error) => {
        console.error('Error al crear la orden: ', error);
      });
  }
}
