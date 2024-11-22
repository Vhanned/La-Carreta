import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, query } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { AdContable, Finanzas, OrdenesDeProduccion, Ventas } from 'src/app/clases/clases.component';
import { where } from 'firebase/firestore';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  DatosContables: AdContable[] = [];
  DatosVentas: Ventas[] = []
  DatosFinanzas: Finanzas[] = [];
  DatosOrdenes: OrdenesDeProduccion[] = [];

  registroSeleccionado: AdContable | null = null;

  FechaHoy:string = new Date().toISOString().split('T')[0];
  FechaSeleccionada:string = '';


  constructor(private firebase: Firestore, private authService: AuthService) {

  }



  ngOnInit(): void {
    this.CargarDatosContables();
  }

  Logout() {
    this.authService.logout();
  }

  Log(event: string) {
    console.log('Fecha seleccionada:', event);
  }
  

  CargarDatosContables() {
    let q = query(this.AdContableDB,where("fecha","==",this.FechaSeleccionada))
    collectionData(q).subscribe((datosContablesSnap) => {
      console.log(datosContablesSnap)
    if(datosContablesSnap.length>0){
      const item = datosContablesSnap[0];
      let datoContable = new AdContable();
      datoContable.setData(item);
      this.registroSeleccionado = datoContable;
    } else {
      console.log('Datos inexistentes')
    }
    })
    console.log(this.registroSeleccionado)
  }

}
