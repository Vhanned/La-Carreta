import { Component, OnInit } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { Producto } from 'src/app/clases/clases.component';

@Component({
  selector: 'inventarios-productos',
  templateUrl: './inventarios-productos.component.html',
  styleUrls: ['./inventarios-productos.component.css']
})
export class InventariosProductosComponent {

  //Agregar producto al inventario
  nuevoProducto = new Producto();

  //Lista de productos
  listaProductos: Producto[] = new Array();

  //Direccion en donde se guardan los productos en firebase
  ProductosBD = collection(this.firebase, "MateriasPrimas");

  constructor(private firebase:Firestore) { 


  }

  



}
