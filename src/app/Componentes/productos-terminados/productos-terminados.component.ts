import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { InventarioProductos } from 'src/app/clases/clases.component';

@Component({
  selector: 'productos-terminados',
  templateUrl: './productos-terminados.component.html',
  styleUrls: ['./productos-terminados.component.css']
})
export class ProductosTerminadosComponent implements OnInit {

//Lista de productos terminados
InvetarioTerminados:InventarioProductos[]=[];
NuevaVenta = new InventarioProductos();

//Coleccion de productos terminados
ProductosTerminadosBD = collection(this.firebase,"ProductosTerminados")

CantidadVenta:number=0;




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

  ModificarPrecio(Producto:InventarioProductos){
    updateDoc(doc(this.firebase,"ProductosTerminados",Producto.Id_producto),{Precio:Producto.Precio})
  }

  RealizarVenta(){

  }

  CargarInfo(Producto:InventarioProductos){
    this.NuevaVenta = Producto;
  }
}
