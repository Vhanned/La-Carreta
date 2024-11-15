import { Component, OnInit } from '@angular/core';
import { CostoOrden, MateriaPrimaUsadaOrden, OrdenesDeProduccion } from 'src/app/clases/clases.component';
import { Firestore } from '@angular/fire/firestore';
import { collection, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';

@Component({
  selector: 'app-reportes-produccion',
  templateUrl: './reportes-produccion.component.html',
  styleUrls: ['./reportes-produccion.component.css']
})
export class ReportesProduccionComponent implements OnInit {

  //Lista en la que se guardaran las ordenes del dia
  CostosDiarios: OrdenesDeProduccion[] = [];

  //Ruta de la coleccion ordenes
  OrdenesBD = collection(this.firebase, "OrdenesProduccion")

  //Fecha de hoy para la consulta a firebase
  FechaHoy = new Date().toISOString().split('T')[0];

  //Costo de las materias usadas en la orden de produccion
  CostoMateriasOrden: MateriaPrimaUsadaOrden[] = [];

  //Costo total de la orden, mostrado en pantalla
  CostoOrden: CostoOrden[] = [];


  constructor(private firebase: Firestore) {
  }


  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
    this.CargarOrdenesDiarias();
  }


  CargarOrdenesDiarias() {
    let q = query(this.OrdenesBD, where("Fecha_Elaboracion", "==", this.FechaHoy), where("Estado", "==", "En produccion"));
    collectionData(q).subscribe((ordenSnap) => {
      this.CostosDiarios = [];  // Reiniciar la lista de productos
      ordenSnap.forEach((item) => {
        let ordenDiaria = new OrdenesDeProduccion();
        console.log('Ordenes cargadas a al lista: ', ordenDiaria)
        ordenDiaria.setData(item);
        this.CostosDiarios.push(ordenDiaria)
        console.log('Ordenes mostradas: ', this.CostosDiarios)
      });
    });
  }

  PrecioTotalOrden(CostosDiarios: OrdenesDeProduccion) {
    console.log('Impresion', CostosDiarios)

  }

  

  CalcularCantidadMateria(orden:OrdenesDeProduccion): number[] {
    let numeroProductos:number[]=[];

    for (let index = 0; index < orden.Cantidad_Producto.length; index++) {
      numeroProductos.push(orden.Cantidad_Producto[index])
      
    }
    console.log('Producto:',numeroProductos)
    return numeroProductos
  }


  trackByIndex(index: number, item: any): number {
    return index;
  }

}
