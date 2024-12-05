import { Component } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { EntradaMateriaPrima, InventarioMateriasPrimas, MateriaPrima } from 'src/app/clases/clases.component';
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

  sugerenciasCodigo: MateriaPrima[] = [];
  sugerenciasNombre: MateriaPrima[] = [];

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
        title: "Por favor, completa todos los campos antes de completar la operacion.",
        showConfirmButton: false,
        timer: 1000
      });
      return;
    } else {
      // Asegurar que la marca tenga un valor por defecto si está vacía
      this.nuevaMateria.Marca = this.nuevaMateria.Marca || "N/A";

      // Buscar si la materia prima ya existe por código o nombre
      const q = query(this.MateriasBD,where('Codigo', '==', this.nuevaMateria.Codigo),where('Nombre', '==', this.nuevaMateria.Nombre));

      getDocs(q).then((snapshot) => {
        if (!snapshot.empty) {
          // Materia prima ya existe, actualizar cantidad
          const materiaExistente = snapshot.docs[0];
          console.log(materiaExistente)
          const materiaData = materiaExistente.data();
          console.log('Existencias: ',materiaData.Existencias)

          const cantidadTemporal = this.nuevaMateria.Existencias
          console.log(cantidadTemporal)

          // Realizar la suma de las cantidades
          const nuevaCantidad = materiaData.Existencias + this.nuevaMateria.Existencias
          console.log(this.nuevaMateria.Existencias)
          console.log(nuevaCantidad)

          // Actualizar la base de datos
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

  buscarCoincidencias(campo: 'Codigo' | 'Nombre', valor: string) {
    if (valor.trim() === '') {
      if (campo === 'Codigo') {
        this.sugerenciasCodigo = [];
      } else {
        this.sugerenciasNombre = [];
      }
      return;
    }

    // Crear la consulta para buscar coincidencias parciales
    const q = query(this.MateriasBD, where(campo, '>=', valor), where(campo, '<=', valor + '\uf8ff'));

    getDocs(q).then((snapshot) => {
      const resultados: MateriaPrima[] = [];
      snapshot.forEach((doc) => {
        const materia = new MateriaPrima();
        materia.setData(doc.data());
        resultados.push(materia);
      });

      if (campo === 'Codigo') {
        this.sugerenciasCodigo = resultados;
      } else {
        this.sugerenciasNombre = resultados;
      }
    }).catch((error) => {
      console.error("Error buscando coincidencias: ", error);
    });
  }

  seleccionarSugerencia(sugerencia: MateriaPrima) {
    // Crear una nueva instancia de MateriaPrima
    const materiaSeleccionada = new MateriaPrima();

    // Usar el método setData para llenar los datos
    materiaSeleccionada.setData(sugerencia);

    // Asignar la nueva instancia a nuevaMateria
    this.nuevaMateria = materiaSeleccionada;

    // Limpiar las sugerencias después de seleccionar
    this.sugerenciasCodigo = [];
    this.sugerenciasNombre = [];

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Se completaron los datos automáticamente.",
      showConfirmButton: false,
      timer: 1500
    });
  }



}
