import { Component } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { EntradaMateriaPrima, MateriaPrima } from 'src/app/clases/clases.component';
import { arrayRemove, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common'


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
  materias: MateriaPrima[] = [];
  materiasFiltradas: MateriaPrima[] = []; // Lista para almacenar el resultado del filtro

  // Texto de búsqueda
  searchText: string = '';

  // Referencia a la colección en Firestore
  MateriasBD = collection(this.firebase, "MateriasPrimas");

  constructor(private firebase: Firestore, private router: Router, private location: Location) {
    this.CargarMaterias();
  }

  // Método para aplicar el filtro según el texto de búsqueda
  filtrarMaterias() {
    this.materiasFiltradas = this.materias.filter(materia =>
      materia.Nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
      materia.Codigo.toLowerCase().includes(this.searchText.toLowerCase()) ||
      materia.Marca.toLowerCase().includes(this.searchText.toLowerCase()) ||
      materia.Tipo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

// Método para agregar/comprar materia prima
agregarMateria() {
  // Verificar que todos los campos estén completos
  if (!this.nuevaMateria.Codigo || !this.nuevaMateria.Nombre || !this.nuevaMateria.Unidad_Medida ||
    !this.nuevaMateria.Precio_unitario || !this.nuevaMateria.Tipo ||
    !this.nuevaMateria.Existencias || this.nuevaMateria.Punto_Reorden === undefined) {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Por favor, completa todos los campos antes de agregar la materia prima.",
      showConfirmButton: false,
      timer: 1000
    });
    return;
  }

  // Asegurar que la marca tenga un valor por defecto si está vacía
  this.nuevaMateria.Marca = this.nuevaMateria.Marca || "N/A";

  // Crear objeto de entrada de materia prima
  const entradaMateria = new EntradaMateriaPrima();
  entradaMateria.Id_RegistroEntrada = this.GenerateRandomString(20);
  entradaMateria.MateriaEntrada = this.nuevaMateria.Nombre;
  entradaMateria.Id_RegistroEntrada = this.nuevaMateria.Id_Materia;
  entradaMateria.CostoCompra = this.nuevaMateria.Precio_unitario;
  entradaMateria.CantidadEntrada = this.nuevaMateria.Existencias;
  entradaMateria.FechaEntrada = new Date().toISOString().split('T')[0];

  // Guardar el registro de entrada en la colección "RegistroEntradas"
  setDoc(doc(this.firebase, "RegistroEntradas", entradaMateria.Id_RegistroEntrada), JSON.parse(JSON.stringify(entradaMateria)))
    .then(() => {
      console.log("Entrada registrada correctamente.");
    })
    .catch((error) => {
      console.error("Error al registrar entrada: ", error);
    });

  // Buscar si la materia prima ya existe por código o nombre
  const q = query(
    this.MateriasBD,
    where('Codigo', '==', this.nuevaMateria.Codigo),
    where('Nombre', '==', this.nuevaMateria.Nombre)
  );

  getDocs(q).then((snapshot) => {
    if (!snapshot.empty) {
      // Materia prima ya existe, actualizar cantidad
      const materiaExistente = snapshot.docs[0];
      const materiaData = materiaExistente.data();

      const nuevaCantidad = materiaData.Existencias + this.nuevaMateria.Existencias;

      updateDoc(doc(this.firebase, "MateriasPrimas", materiaExistente.id), {
        Existencias: nuevaCantidad
      }).then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cantidad actualizada correctamente.",
          showConfirmButton: false,
          timer: 1000
        });
      }).catch((error) => {
        console.error("Error al actualizar cantidad: ", error);
      });
    } else {
      // Materia prima no existe, crear nuevo registro
      this.nuevaMateria.Id_Materia = this.GenerateRandomString(20);
      let nuevaMateriaDoc = doc(this.firebase, "MateriasPrimas", this.nuevaMateria.Id_Materia);

      setDoc(nuevaMateriaDoc, JSON.parse(JSON.stringify(this.nuevaMateria)))
        .then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Materia prima agregada exitosamente.",
            showConfirmButton: false,
            timer: 1000
          });
          this.limpiarFormulario();
        })
        .catch((error) => {
          console.error("Error al agregar materia prima: ", error);
        });
    }
  }).catch((error) => {
    console.error("Error al buscar materia prima: ", error);
  });

  // Cerrar el modal después de guardar
  let btnCerrar = document.getElementById('btnCerrarModalElemento');
  btnCerrar?.click();
}


  // Método para seleccionar una materia prima para edición
  EditarModalMateria(materia: MateriaPrima) {
    this.materiaAEditar = materia;
  }

  // Método para editar una materia prima existente
  editarMateria() {
    let materiaDoc = doc(this.firebase, "MateriasPrimas", this.materiaAEditar.Id_Materia);
    setDoc(materiaDoc, JSON.parse(JSON.stringify(this.materiaAEditar)))
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Informacion actualizada exitosamente",
          showConfirmButton: false,
          timer: 1000
        });
      })
      .catch((error) => {
        console.error("Error al actualizar la informacion: ", error);
      });

    let btnCerrarEditar = document.getElementById('btnCerrarEditarElemento');
    btnCerrarEditar?.click();
  }


  // Método para limpiar el formulario después de agregar o editar una materia
  limpiarFormulario() {
    this.nuevaMateria = new MateriaPrima(); // Resetea la nueva materia
    this.materiaAEditar = new MateriaPrima(); // Resetea la materia a editar
  }

  CargarMaterias() {
    // Cargar las materias primas desde Firestore al iniciar el componente
    let q = query(this.MateriasBD, orderBy('Codigo', 'asc'));
    collectionData(q).subscribe((materiaPrimaSnap) => {
      this.materias = [];
      materiaPrimaSnap.forEach((item) => {
        let materiaPrima = new MateriaPrima();
        materiaPrima.setData(item);
        this.materias.push(materiaPrima);
      });
      this.filtrarMaterias(); // Aplicar el filtro después de cargar los datos
    });
  }

  LimpiarFormulario() {
    this.nuevaMateria = new MateriaPrima();
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
  validarTecla(event: KeyboardEvent) {
    if (event.key === '-' || event.key.toLowerCase() === 'e') {
      event.preventDefault();
    }
  }

  

}
