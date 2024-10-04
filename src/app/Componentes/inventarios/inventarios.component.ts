import { Component, OnInit } from '@angular/core';
import { MateriaPrima } from 'src/app/clases/clases.component';

@Component({
  selector: 'inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent {

  // Lista de materias primas
  materias: MateriaPrima[] = [
    new MateriaPrima(), // Instancias iniciales, podrías usar el método `setData()` si es necesario
    new MateriaPrima()
  ];

  // Materia prima temporal para agregar una nueva
  nuevaMateria: MateriaPrima = new MateriaPrima();

  constructor() {
      // Llenar datos de prueba para las materias
      this.materias[0].setData({
        Id_Materia: '001',
        Nombre: 'Materia A',
        Unidad_Medida: 'lts',
        Marca: 'Marca X',
        Punto_Reorden: 10
      });
      this.materias[1].setData({
        Id_Materia: '002',
        Nombre: 'Materia B',
        Unidad_Medida: 'kgs',
        Marca: 'Marca Y',
        Punto_Reorden: 15
      });
    }

    // Método para agregar la nueva materia a la lista
    agregarMateria() {
      const nueva = new MateriaPrima();
      nueva.setData({
        Id_Materia: '00' + (this.materias.length + 1), // Generar un ID automático
        Nombre: this.nuevaMateria.Nombre,
        Unidad_Medida: this.nuevaMateria.Unidad_Medida,
        Marca: this.nuevaMateria.Marca,
        Punto_Reorden: this.nuevaMateria.Punto_Reorden
      });
      
      this.materias.push(nueva); // Agregar a la lista
      this.limpiarFormulario(); // Limpiar el formulario después de agregar
    }

    // Método para limpiar el formulario
    limpiarFormulario() {
      this.nuevaMateria = new MateriaPrima(); // Resetea la nueva materia
    }

}

  


