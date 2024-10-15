import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private routing:Router) {

   }

   IrInventario(){
    this.routing.navigate(['inventarios']);
   }

   IrLogin(){
    this.routing.navigate(['login']);
   }

   IrOrdenesProduccion(){
    this.routing.navigate(['ordenes-produccion']);
   }

   IrProductos(){
    this.routing.navigate(['inventarios-productos']);
   }

}
