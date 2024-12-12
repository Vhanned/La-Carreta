import { Component, OnInit } from '@angular/core';
import { collection, Firestore, query, collectionData, orderBy, where } from '@angular/fire/firestore';
import { EntradaMateriaPrima, SalidaProducto } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  // Listas para almacenar datos
  EntradasMateriasPrimas: any[] = [];
  SalidasProductos: any[] = [];

  // Fechas de búsqueda
  fechaInicio: string = '';
  fechaFin: string = '';
  BusquedaPresionado: boolean = false;

  // Referencias a colecciones en Firestore
  entradasCollection = collection(this.firebase, 'RegistroEntradas');
  salidasCollection = collection(this.firebase, 'SalidaProducto');

  constructor(private firebase: Firestore) {
    this.cargarEntradasMateriasPrimas();
    this.cargarSalidasProductos();
  }

  ngOnInit(): void {

  }

  // Cargar datos de entradas
  cargarEntradasMateriasPrimas() {
    const q = query(this.entradasCollection, orderBy('FechaEntrada', 'desc'));
    collectionData(q).subscribe((data) => {
      this.EntradasMateriasPrimas = data.map((item) => ({
        id: item.Id_MateriaEntrada || '',
        fecha: item.FechaEntrada || '',
        nombreMateria: item.MateriaEntrada || '',
        cantidad: item.CantidadEntrada || 0,
        unidad: item.Unidad || '',
        costo: item.CostoCompra,
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

  limpiarBusquedas() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarEntradasMateriasPrimas();
    this.cargarSalidasProductos();
    this.BusquedaPresionado = false;
  }

  buscarRegistros() {

    if (!this.fechaInicio || !this.fechaFin) {
      Swal.fire('Error', 'Por favor selecciona ambas fechas para realizar la busqueda', 'error')
      return;
    }

    // Asegurar formato de fechas
    const inicioDate = this.fechaInicio ? this.fechaInicio : '1900-01-01';
    const finalDate = this.fechaFin ? this.fechaFin : new Date().toISOString().split('T')[0];

    console.log('Rango de búsqueda: ', { inicioDate, finalDate });

    // Buscar entradas
    const qEntradas = query(
      this.entradasCollection,
      where('FechaEntrada', '>=', inicioDate),
      where('FechaEntrada', '<=', finalDate),
      orderBy('FechaEntrada', 'desc')
    );
    collectionData(qEntradas).subscribe((data) => {
      console.log('Entradas obtenidas:', data); // Debug
      this.EntradasMateriasPrimas = data.map((item) => ({
        id: item.Id_MateriaEntrada,
        fecha: item.FechaEntrada,
        nombreMateria: item.MateriaEntrada,
        cantidad: item.CantidadEntrada,
        unidad: item.Unidad,
        costo: item.CostoCompra,
        proveedor: item.Proveedor,
      }));
    });

    // Buscar salidas
    const qSalidas = query(
      this.salidasCollection,
      where('FechaSalida', '>=', inicioDate),
      where('FechaSalida', '<=', finalDate),
      orderBy('FechaSalida', 'desc')
    );
    collectionData(qSalidas).subscribe((data) => {
      console.log('Salidas obtenidas:', data); // Debug
      this.SalidasProductos = data.map((item) => ({
        id: item.Id_RegistroSalida,
        fecha: item.FechaSalida,
        nombreProducto: item.ProductoSalida,
        cantidad: item.CantidadSalida,
        precio: item.Precio,
      }));
    });

    this.BusquedaPresionado = true;

  }

  generarExcel() {
    console.log(this.EntradasMateriasPrimas)
    console.log(this.SalidasProductos)
    if (this.EntradasMateriasPrimas.length <= 0 || this.SalidasProductos.length <= 0) {
      Swal.fire('Error', 'No hay registros para generar un archivo excel', 'error');
    } else {
      const workbook = XLSX.utils.book_new();

      /* // Generar hoja de entradas
      const hojaEntradas = XLSX.utils.json_to_sheet(
        this.EntradasMateriasPrimas.map((entrada) => ({
          Fecha: entrada.fecha,
          MateriaPrima: entrada.nombreMateria,
          Unidad: entrada.unidad,
          Cantidad: entrada.cantidad,
          Costo: entrada.costo
        }))
      );
      XLSX.utils.book_append_sheet(workbook, hojaEntradas, 'Entradas');*/

      // Generar hoja de salidas
      const hojaSalidas = XLSX.utils.json_to_sheet(
        this.SalidasProductos.map((salida) => ({
          Fecha: salida.fecha,
          Producto: salida.nombreProducto,
          Cantidad: salida.cantidad,
          Precio: salida.precio
        }))
      );
      XLSX.utils.book_append_sheet(workbook, hojaSalidas, 'Salidas');

      // Guardar archivo
      const nombreArchivo = `Registros_${this.fechaInicio}_${this.fechaFin}.xlsx`;
      XLSX.writeFile(workbook, nombreArchivo);
    }
  }

  // Formatear fecha a dd/mm/yyyy
  formatFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }
}