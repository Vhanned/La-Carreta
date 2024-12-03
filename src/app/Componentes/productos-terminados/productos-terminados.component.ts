import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { InventarioProductos, SalidaProducto } from 'src/app/clases/clases.component';

@Component({
  selector: 'productos-terminados',
  templateUrl: './productos-terminados.component.html',
  styleUrls: ['./productos-terminados.component.css']
})
export class ProductosTerminadosComponent implements OnInit {

//Lista de productos terminados
InvetarioTerminados:InventarioProductos[]=[];

NuevaVenta = new InventarioProductos();
RegistroSalida = new SalidaProducto();

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
    updateDoc(doc(this.firebase,"ProductosTerminados",Producto.Id_producto),{Precio:Producto.Precio});
    
  }

  SalidaDeProducto(NuevaVenta:InventarioProductos){

    updateDoc(doc(this.firebase,"ProductosTerminados",NuevaVenta.Id_producto),{Cantidad:increment(-this.CantidadVenta)});

    this.RegistroSalida.Id_ProductoSalida=NuevaVenta.Id_producto;
    this.RegistroSalida.CantidadSalida=this.CantidadVenta;
    this.RegistroSalida.Id_RegistroSalida=this.GenerateRandomString(20);
    this.RegistroSalida.Precio=NuevaVenta.Precio;
    this.RegistroSalida.ProductoSalida=NuevaVenta.Nombre_Producto;
    this.RegistroSalida.FechaSalida = new Date().toISOString().split('T')[0];


    setDoc(doc(this.firebase,"SalidaProducto",this.GenerateRandomString(20)),JSON.parse(JSON.stringify(this.RegistroSalida)));

    let BtnCerrar = document.getElementById("btnCerrarModalElemento");
    BtnCerrar?.click();
  }

  CargarInfo(Producto:InventarioProductos){
    this.NuevaVenta = Producto;
  }

  GenerateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validarTecla(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

}
