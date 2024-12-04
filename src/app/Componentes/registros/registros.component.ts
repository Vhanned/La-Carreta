import { Component, OnInit } from '@angular/core';
import { collection, Firestore, query, collectionData, orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  // Listas para almacenar datos
  EntradasMateriasPrimas: any[] = [];
  SalidasProductos: any[] = [];

  // Referencias a colecciones en Firestore
  entradasCollection = collection(this.firebase, 'EntradasMateriaPrima');
  salidasCollection = collection(this.firebase, 'SalidaProducto');

  constructor(private firebase: Firestore) {}

  ngOnInit(): void {
    this.cargarEntradasMateriasPrimas();
    this.cargarSalidasProductos();
  }

  // Cargar datos de entradas
  cargarEntradasMateriasPrimas() {
    const q = query(this.entradasCollection, orderBy('fecha', 'desc'));
    collectionData(q).subscribe((data) => {
      this.EntradasMateriasPrimas = data.map((item) => ({
        id: item.Id_Entrada || '',
        fecha: item.Fecha || '',
        nombreMateria: item.MateriaPrima || '',
        cantidad: item.Cantidad || 0,
        unidad: item.Unidad || '',
        proveedor: item.Proveedor || 'N/A'
      }));
    });
  }

  // Cargar datos de salidas
  cargarSalidasProductos() {
    const q = query(this.salidasCollection, orderBy('FechaSalida', 'desc'));
    collectionData(q).subscribe((data) => {
      this.SalidasProductos = data.map((item) => ({
        id: item.Id_RegistroSalida || '',
        fecha: item.FechaSalida || '',
        nombreProducto: item.ProductoSalida || '',
        cantidad: item.CantidadSalida || 0,
        precio: item.Precio || 0
      }));
    });
  }

  // Formatear fecha a dd/mm/yyyy
  formatFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }
}
