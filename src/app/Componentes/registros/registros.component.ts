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
      alert('Por favor, selecciona ambas fechas para realizar la búsqueda.');
      return;
    }

    const inicio = new Date(this.fechaInicio).toISOString();
    const fin = new Date(this.fechaFin).toISOString();

    // Buscar entradas
    const qEntradas = query(this.entradasCollection, where('FechaEntrada', '>=', inicio), where('FechaEntrada', '<=', fin), orderBy('FechaEntrada', 'desc'));
    collectionData(qEntradas).subscribe((data) => {
      this.EntradasMateriasPrimas = [];
      this.EntradasMateriasPrimas = data.map((item) => ({
        id: item.Id_MateriaEntrada,
        fecha: item.FechaEntrada,
        nombreMateria: item.MateriaEntrada,
        cantidad: item.CantidadEntrada,
        unidad: item.Unidad,
        costo: item.CostoCompra,
        proveedor: item.Proveedor
      }));
    });

    // Buscar salidas
    const qSalidas = query(this.salidasCollection, where('FechaSalida', '>=', inicio), where('FechaSalida', '<=', fin), orderBy('FechaSalida', 'desc'));
    collectionData(qSalidas).subscribe((data) => {
      this.SalidasProductos = [];
      this.SalidasProductos = data.map((item) => ({
        id: item.Id_RegistroSalida,
        fecha: item.FechaSalida,
        nombreProducto: item.ProductoSalida,
        cantidad: item.CantidadSalida,
        precio: item.Precio
      }));
    });

    this.BusquedaPresionado = true;
  }

  generarExcel() {
    console.log(this.EntradasMateriasPrimas)
    console.log(this.SalidasProductos)
    if (this.EntradasMateriasPrimas.length<=0 || this.SalidasProductos.length<=0) {
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