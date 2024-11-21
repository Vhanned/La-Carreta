import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { InventarioProductos } from 'src/app/clases/clases.component';

@Component({
  selector: 'productos-terminados',
  templateUrl: './productos-terminados.component.html',
  styleUrls: ['./productos-terminados.component.css']
})
export class ProductosTerminadosComponent implements OnInit {

//Lista de productos terminados
InvetarioTerminados:InventarioProductos[]=[];

//Coleccion de productos terminados
ProductosTerminadosBD = collection(this.firebase,"ProductosTerminados")



  constructor(private firebase:Firestore) { 
    this.CargarProductosTerminados();
  }

  ngOnInit(): void {
  }

  CargarProductosTerminados(){
    let q = query(this.ProductosTerminadosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.InvetarioTerminados = [];  // Reiniciar la lista de productos
      productoSnap.forEach((item) => {
        let producto = new InventarioProductos();
        producto.setData(item);
        this.InvetarioTerminados.push(producto)
      });
    });
  }

  GenerateRandomString(num: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
