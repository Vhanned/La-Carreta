import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.css']
})
export class OrdenesProduccionComponent {




  constructor(private firebase: Firestore) {


  }


  CrearOrdenProduccion() {

    let btnCerrar = document.getElementById('btnCerrarModalElemento');
    btnCerrar?.click();
  }


}
