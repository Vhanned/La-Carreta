import { Component } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { MateriaPrima } from 'src/app/clases/clases.component';
import { arrayRemove, query } from 'firebase/firestore';

@Component({
  selector: 'inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent {

  // Materia prima temporal para agregar o editar
  nuevaMateria = new MateriaPrima();
  materiaAEditar = new MateriaPrima();

  // Lista de materias primas obtenidas de Firestore
  materias: MateriaPrima[] = new Array();

  // Referencia a la colección en Firestore
  MateriasBD = collection(this.firebase, "MateriasPrimas");

  constructor(private firebase: Firestore) {
    // Cargar las materias primas desde Firestore al iniciar el componente
    let q = query(this.MateriasBD);
    collectionData(q).subscribe((materiaPrimaSnap) => {
      this.materias = new Array();
      materiaPrimaSnap.forEach((item) => {
        let materiaPrima = new MateriaPrima();
        materiaPrima.setData(item);
        console.log(item);
        this.materias.push(materiaPrima);
      });
    });
  }

  // Método para agregar una nueva materia prima
  agregarMateria() {
    this.nuevaMateria.Id_Materia = this.GenerateRandomString(20); // Generar un ID único para la nueva materia
    let nuevaMateriaDoc = doc(this.firebase, "MateriasPrimas", this.nuevaMateria.Id_Materia);

    // Guardar la nueva materia en Firestore
    setDoc(nuevaMateriaDoc, JSON.parse(JSON.stringify(this.nuevaMateria)))
      .then(() => {
        alert("Materia prima agregada exitosamente");
        this.limpiarFormulario();
      })
      .catch((error) => {
        console.error("Error al agregar materia prima: ", error);
      });

    let btnCerrar = document.getElementById('btnCerrarModalElemento');
    btnCerrar?.click();

  }

  // Método para seleccionar una materia prima para edición
  EditarModalMateria(materia: MateriaPrima) {
    this.materiaAEditar = materia;
  }
  // Método para editar una materia prima existente
  editarMateria() {

    // Actualizar los datos de la materia en Firestore
    let materiaDoc = doc(this.firebase, "MateriasPrimas", this.materiaAEditar.Id_Materia);
    setDoc(materiaDoc, JSON.parse(JSON.stringify(this.materiaAEditar)))
      .then(() => {
        alert("Materia prima actualizada exitosamente");
      })
      .catch((error) => {
        console.error("Error al actualizar materia prima: ", error);
      });

      /*
      let rutaDoc = doc(this.firebase, "Laptops", this.EditarLap.IDLaptop);
      setDoc(rutaDoc, JSON.parse(JSON.stringify(this.EditarLap)));
      alert("Edición exitosa"); 
    */

    let btnCerrarEditar = document.getElementById('btnCerrarEditarElemento');
    btnCerrarEditar?.click();
  }

  // Método para eliminar una materia prima
  eliminarMateria(materia: MateriaPrima) {
    let materiaDoc = doc(this.firebase, "MateriasPrimas", materia.Id_Materia);

    // Eliminar la materia de Firestore
    deleteDoc(materiaDoc)
      .then(() => {
        alert("Materia prima eliminada exitosamente");
      })
      .catch((error) => {
        console.error("Error al eliminar materia prima: ", error);
      });
  }

  // Método para limpiar el formulario después de agregar o editar una materia
  limpiarFormulario() {
    this.nuevaMateria = new MateriaPrima(); // Resetea la nueva materia
    this.materiaAEditar = new MateriaPrima(); // Resetea la materia a editar
  }

  // Generar un string aleatorio de longitud 'num' (usado para generar IDs únicos)
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
