import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Componentes/services/auth.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private routing: Router, private authService: AuthService) { } // Inyecta el servicio

  IrInventario(){
    this.routing.navigate(['inventarios']);
  }

  IrLogin(){
    this.authService.logout(); // Llama al método de cierre de sesión
  }

  IrOrdenesProduccion(){
    this.routing.navigate(['ordenes-produccion']);
  }

  IrProductos(){
    this.routing.navigate(['inventarios-productos']);
  }

  IrReportes(){
    this.routing.navigate(['reportes-produccion']);
  }

  IrSubproductos(){
    this.routing.navigate(['subproductos']);
  }

  IrProductosTerminados(){
    this.routing.navigate(['productos-terminados'])
  }

  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }
  
}
