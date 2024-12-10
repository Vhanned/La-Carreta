import { Component } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import * as XLSX from 'xlsx';
import { EntradaMateriaPrima, SalidaProducto } from 'src/app/clases/clases.component';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent {
  // Fechas de búsqueda
  fechaInicio: string = '';
  fechaFin: string = '';

  // Registros
  registrosEntradas: EntradaMateriaPrima[] = [];
  registrosSalidas: SalidaProducto[] = [];

  // Referencias a colecciones
  entradasBD = collection(this.firebase, 'RegistroEntradas');
  salidasBD = collection(this.firebase, 'SalidaProducto');

  constructor(private firebase: Firestore) {
    this.cargarTodosLosRegistros();
  }

  cargarTodosLosRegistros() {
    // Cargar todas las entradas sin filtro
    collectionData(this.entradasBD).subscribe((data: any[]) => {
      this.registrosEntradas = data.map((item) => {
        const entrada = new EntradaMateriaPrima();
        entrada.setData(item);
        return entrada;
      });
    });

    // Cargar todas las salidas sin filtro
    collectionData(this.salidasBD).subscribe((data: any[]) => {
      this.registrosSalidas = data.map((item) => {
        const salida = new SalidaProducto();
        salida.setData(item);
        return salida;
      });
    });
  }

  buscarRegistros() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor, selecciona ambas fechas para realizar la búsqueda.');
      return;
    }

    const inicio = new Date(this.fechaInicio).toISOString();
    const fin = new Date(this.fechaFin).toISOString();

    // Buscar entradas
    const qEntradas = query(this.entradasBD, where('FechaEntrada', '>=', inicio), where('FechaEntrada', '<=', fin));
    collectionData(qEntradas).subscribe((data: any[]) => {
      this.registrosEntradas = data.map((item) => {
        const entrada = new EntradaMateriaPrima();
        entrada.setData(item);
        return entrada;
      });
    });

    // Buscar salidas
    const qSalidas = query(this.salidasBD, where('FechaSalida', '>=', inicio), where('FechaSalida', '<=', fin));
    collectionData(qSalidas).subscribe((data: any[]) => {
      this.registrosSalidas = data.map((item) => {
        const salida = new SalidaProducto();
        salida.setData(item);
        return salida;
      });
    });
  }

  generarExcel() {
    const workbook = XLSX.utils.book_new();

    // Generar hoja de entradas
    const hojaEntradas = XLSX.utils.json_to_sheet(
      this.registrosEntradas.map((entrada) => ({
        Fecha: entrada.FechaEntrada,
        'Materia Prima': entrada.MateriaEntrada,
        Cantidad: entrada.CantidadEntrada,
        Costo: entrada.CostoCompra
      }))
    );
    XLSX.utils.book_append_sheet(workbook, hojaEntradas, 'Entradas');

    // Generar hoja de salidas
    const hojaSalidas = XLSX.utils.json_to_sheet(
      this.registrosSalidas.map((salida) => ({
        Fecha: salida.FechaSalida,
        Producto: salida.ProductoSalida,
        Cantidad: salida.CantidadSalida,
        Precio: salida.Precio
      }))
    );
    XLSX.utils.book_append_sheet(workbook, hojaSalidas, 'Salidas');

    // Guardar archivo
    const nombreArchivo = `Registros_${this.fechaInicio}_${this.fechaFin}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
  }
}
