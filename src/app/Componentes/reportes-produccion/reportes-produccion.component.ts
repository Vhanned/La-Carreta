import { Component, OnInit } from '@angular/core';
import { CostoOrden, MateriaPrimaUsadaOrden, OrdenesDeProduccion, Producto } from 'src/app/clases/clases.component';
import { Firestore } from '@angular/fire/firestore';
import { collection, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';

@Component({
  selector: 'reportes-produccion',
  templateUrl: './reportes-produccion.component.html',
  styleUrls: ['./reportes-produccion.component.css']
})
export class ReportesProduccionComponent implements OnInit {

  CostosDiarios: OrdenesDeProduccion[] = [];

  OrdenesBD = collection(this.firebase, "OrdenesProduccion")

  FechaHoy = new Date().toLocaleDateString();

  constructor(private firebase: Firestore) {
    this.CargarOrdenesDiarias();
  }

  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }

  // Formatea la fecha para la consulta a Firebase
  FormatearFecha(Fecha: string): string {
    const hoy = Fecha.split('/');
    console.log('Slit',hoy)
    const HoyFormatoDate = `${hoy[2]}-${hoy[0]}-${hoy[1]}`;
    console.log('Nuevo formato de hoy',HoyFormatoDate)
    return new Date(HoyFormatoDate).toISOString().split('T')[0];
  }

  // Cargar órdenes de producción diarias
  CargarOrdenesDiarias() {

    let q = query(this.OrdenesBD, where("Estado", "==", "En produccion"),where("Fecha_Elaboracion","==",this.FormatearFecha(this.FechaHoy)));
    collectionData(q).subscribe((ordenSnap) => {
      this.CostosDiarios = [];
      ordenSnap.forEach((item) => {
        let ordenDiaria = new OrdenesDeProduccion();
        ordenDiaria.setData(item);
        this.CostosDiarios.push(ordenDiaria);
      });
    });

    console.log(this.FormatearFecha(this.FechaHoy))
  }

  // Calcular el costo total de cada orden
  calcularCostoTotal(orden: OrdenesDeProduccion): number {
    let costoTotal = 0;

    orden.Producto_Elaborado.forEach((producto: Producto, index: number) => {
      const cantidadProducto = orden.Cantidad_Producto[index] || 0;

      producto.Materias_Primas.forEach((materia, materiaIndex) => {
        const cantidadUsada = producto.Cantidad_MateriasPrimas[materiaIndex] * cantidadProducto;
        const costoMateria = (materia.Precio_unitario || 0) * cantidadUsada;
        costoTotal += costoMateria;
      });
    });

    return costoTotal;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
