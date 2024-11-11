import { Component, OnInit } from '@angular/core';
import { OrdenesDeProduccion } from 'src/app/clases/clases.component';
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


  constructor(private firebase: Firestore) {
    this.CargarOrdenesDiarias();

  }


  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }


    CargarOrdenesDiarias(){
      let q = query(this.OrdenesBD, where("Fecha_Elaboracion", "==", this.FechaHoy));
      collectionData(q).subscribe((ordenSnap) => {
        this.CostosDiarios = [];  // Reiniciar la lista de productos
        ordenSnap.forEach((item) => {
          let ordenDiaria = new OrdenesDeProduccion();
          ordenDiaria.setData(item);
          this.CostosDiarios.push(ordenDiaria)
        });
      });
    }
  }
