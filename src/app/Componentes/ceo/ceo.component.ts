import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, query } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { AdContable, Finanzas, MateriaPrima, OrdenesDeProduccion, Produccion, Ventas } from 'src/app/clases/clases.component';
import { where } from 'firebase/firestore';

@Component({
  selector: 'app-ceo',
  templateUrl: './ceo.component.html',
  styleUrls: ['./ceo.component.css']
})
export class CEOComponent implements OnInit {

  AdContableDB = collection(this.firebase, "AdCont")
  VentasDB = collection(this.firebase, "Ventas")
  FinanzasDB = collection(this.firebase, "Finanzas")
  OrdenesDB = collection(this.firebase, "OrdenesProduccion")
  MateriasPrimasBD = collection(this.firebase, "MateriasPrimas")


  DatosContables = new AdContable();
  DatosVentas = new Ventas();
  DatosFinanzas = new Finanzas();
  DatosOrdenes = new OrdenesDeProduccion();
  DatosProduccion = new Produccion();

  ListaMateriasPrimasBD: MateriaPrima[] = [];
  CostoTotalMaterias:number|undefined;

  FechaHoy: string = new Date().toISOString().split('T')[0];


  constructor(private firebase: Firestore, private authService: AuthService) {
    this.CargarDatosContables();
    this.CargarDatosFinanzas();
    this.CargarDatosVentas();
    this.CargarDatosProduccion();
    this.CalcularCostoInventario();
  }



  ngOnInit(): void {
  }

  Logout() {
    this.authService.logout();
  }

  Log(event: string) {
    console.log('Fecha seleccionada:', event);
  }


  CargarDatosContables() {
    let q = query(this.AdContableDB, where("fecha", "==", this.FechaHoy))
    collectionData(q).subscribe((datosContablesSnap) => {
      if (datosContablesSnap.length > 0) {
        const item = datosContablesSnap[0];
        this.DatosContables.setData(item);
      }
    })
  }

  CargarDatosVentas() {
    let q = query(this.VentasDB, where("fecha", "==", this.FechaHoy))
    collectionData(q).subscribe((datosVentasSnap) => {
      if (datosVentasSnap.length > 0) {
        const item = datosVentasSnap[0];
        this.DatosVentas.setData(item);
      }
    })
  }

  CargarDatosFinanzas() {
    let q = query(this.FinanzasDB, where("fecha", "==", this.FechaHoy))
    collectionData(q).subscribe((datosFinanzasSnap) => {
      if (datosFinanzasSnap.length > 0) {
        const item = datosFinanzasSnap[0];
        this.DatosFinanzas.setData(item);
      }
    })
  }

  CargarDatosProduccion() {

  }

  CalcularCostoInventario() {
    let q = query(this.MateriasPrimasBD)
    collectionData(q).subscribe((materiaSnap) => {
      this.ListaMateriasPrimasBD = [];
      materiaSnap.forEach((item) => {
        let materia = new MateriaPrima();
        materia.setData(item)
        this.ListaMateriasPrimasBD.push(materia)
        console.log(this.ListaMateriasPrimasBD)
      });
    })

    this.ListaMateriasPrimasBD.forEach((materiaPrima, i) => {
      
    });
  }

  CargarDatos() {
    this.CargarDatosContables();
    this.CargarDatosFinanzas();
    this.CargarDatosVentas();
    this.CargarDatosProduccion();
  }

}
