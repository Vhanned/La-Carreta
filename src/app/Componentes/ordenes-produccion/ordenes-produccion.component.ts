import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc, query, setDoc, increment } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { orderBy, where } from 'firebase/firestore';
import { find } from 'rxjs/operators';
import { Producto, OrdenesDeProduccion, MateriaPrimaInfo, MateriaPrimaUsadaOrden } from 'src/app/clases/clases.component';
import Swal from 'sweetalert2'; // Importamos SweetAlert

@Component({
  selector: 'ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.css']
})
export class OrdenesProduccionComponent implements OnInit {

  cantidadesMaterias: number[] = [];
  costosMaterias: number[] = [];
  costoTotal: number = 0;

  // Lista de ordenes de producción traida de la base de datos
  ListaOrdenes: OrdenesDeProduccion[] = [];
  ListaOrdenesOriginales: OrdenesDeProduccion[] = []; // Lista original de órdenes

  // Variable para la edición de la producción
  EditarProduccionModal = new OrdenesDeProduccion();

  // Variable temporal para ver los detalles y modificar costos
  VerDetallesProduccion = new OrdenesDeProduccion();

  // Lista de los productos activos disponibles para su elaboración
  ListaProductos: Producto[] = [];
  //Lista de materias primas usadas en la fabricacion
  ListaMateriasEditar: MateriaPrimaInfo[] = [];
  MateriasBD = collection(this.firebase, "MateriasPrimas");

  // Lista de productos agregados a la orden de producción
  ProductosAgregadosOrdenProduccion = new OrdenesDeProduccion();

  OrdenProduccion = new OrdenesDeProduccion();

  //Cantidad de materias devueltas si la orden se elimina
  MateriasUsadasDevueltas: MateriaPrimaUsadaOrden[] = [];

  // Dirección de la colección en Firestore de la que se consultan los productos
  ProductosBD = collection(this.firebase, "Productos");

  // Dirección de la colección de las órdenes de producción
  OrdenesBD = collection(this.firebase, 'OrdenesProduccion');

  // Variables para almacenar las fechas de búsqueda
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private firebase: Firestore) {
    this.CargarProductos();
    this.CargarListaOrdenesProduccion();
  }

  ngOnInit() {

  }

  CargarProductos() {
    let q = query(this.ProductosBD);
    collectionData(q).subscribe((productoSnap) => {
      this.ListaProductos = [];  // Reiniciar la lista de productos
      productoSnap.forEach((item) => {
        let producto = new Producto();
        producto.setData(item);
        // Verificar si el producto está en estado "Activo"
        if (producto.Estado === "Activo") {
          if (!producto.Cantidad_MateriasPrimas || producto.Cantidad_MateriasPrimas.length !== producto.Materias_Primas.length) {
            producto.Cantidad_MateriasPrimas = Array(producto.Materias_Primas.length).fill(0);
          }
          this.ListaProductos.push(producto);
        }
      });
    });

  }

  CargarListaOrdenesProduccion() {
    let q = query(this.OrdenesBD, orderBy('Fecha_Creacion', 'desc'));
    collectionData(q).subscribe((ordenesSnap) => {
      this.ListaOrdenes = [];
      this.ListaOrdenesOriginales = []; // Guardamos la lista original
      ordenesSnap.forEach((item) => {
        let orden = new OrdenesDeProduccion();
        orden.setData(item);
        this.ListaOrdenes.push(orden);
        this.ListaOrdenesOriginales.push(orden); // Almacenar en la lista original
      });
    });
  }



  FiltrarOrdenesPorFecha(fechaInicio: string, fechaFin: string) {

    /* Al traer la fecha del input date esta es obtenida con el formato
    año 4 digitos / mes 2 digitos / dia 2 digitos  
          [0]            [1]            [2]

    Al convertir la fecha en objeto Date.toLocaleDateString esta es devuelta con 
    formato de 
    
    dia 2 digitos / mes 2 digitos / año 4 digitos
          [0]             [1]           [2]

    pero por alguna razon el dia es devuelto -1, si en el input tengo
    7 en mi Date tendre 6 por alguna razon.

    La fecha almacenada del input siempre es separada por "-" y 
    la fehca almacenada del Date siempre es separada por "/"


    El formato me quedaria como (reacomodando los datos del input al formato de Date)

    dia 2 digitos / mes 2 digitoas / año 4 digitos 
          [1]              [2]            [0]  

    (la manera en la que opera date.tolocaledatestring sigue siendo un misterio
    incluso para los profesionales)
     */

    const inicio = fechaInicio.split('-');
    const InicioFormatoDate = `${inicio[1]}-${inicio[2]}-${inicio[0]}`;

    const final = fechaFin.split('-');
    const FinFormatoDate = `${final[1]}-${final[2]}-${final[0]}`;

    const inicioDate = new Date(InicioFormatoDate).toLocaleDateString();

    const finalDate = new Date(FinFormatoDate).toLocaleDateString();



    this.ListaOrdenes = this.ListaOrdenesOriginales.filter(orden => {
      if (!orden.Fecha_Creacion) {
        return false;
      }

      const creacion = new Date(orden.Fecha_Creacion).toLocaleDateString();
      const isWithinRange = creacion >= inicioDate && creacion <= finalDate;
      return isWithinRange;
    })
  }

  ResetOrdenes() {
    this.CargarListaOrdenesProduccion();
    this.fechaInicio = '';
    this.fechaFin = '';
  }

  CrearOrdenProduccion() {
    // Valida la cantidad de materia antes de proceder
    let inventarioSuficiente = true;

    // Continúa con la creación de la orden si hay suficiente inventario
    this.OrdenProduccion.Fecha_Creacion = new Date().toLocaleString();

    if (!this.OrdenProduccion.Fecha_Elaboracion || !this.OrdenProduccion.Fecha_Finalizacion ||
      !this.OrdenProduccion.Solicitante || this.OrdenProduccion.Producto_Elaborado.length === 0 ||
      !this.OrdenProduccion.Cantidad_Producto || !this.OrdenProduccion.Fecha_Creacion || this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.length === 0) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }

    const fechaCreacion = (this.OrdenProduccion.Fecha_Creacion);
    const fechaFinalizacion = (this.OrdenProduccion.Fecha_Finalizacion);

    if (fechaFinalizacion < fechaCreacion) {
      Swal.fire('Error', 'La fecha de finalización no puede ser anterior a la fecha de creación', 'error');
      return;
    }

    // Revisa si alguna materia no tiene suficiente inventario
    console.log(this.ListaMateriasEditar)
    this.ListaMateriasEditar.forEach((materia) => {
      if (materia.cantidadausar > materia.existencias) {
        inventarioSuficiente = false;
      }
    });

    // Si no hay inventario suficiente, muestra el mensaje y detén la función
    if (!inventarioSuficiente) {
      Swal.fire('Error', 'No tiene materia suficiente para proceder con la producción', 'error');
      return;
    }

    this.OrdenProduccion.Id_Orden = this.GenerateRandomString(20);
    this.OrdenProduccion.Estado = 'Pendiente'

    let NuevaOrdenDoc = doc(this.firebase, "OrdenesProduccion", this.OrdenProduccion.Id_Orden);

    setDoc(NuevaOrdenDoc, JSON.parse(JSON.stringify(this.OrdenProduccion)))
      .then(() => {
        Swal.fire('Éxito', 'Orden creada correctamente', 'success');

        this.ListaMateriasEditar.forEach((materia) => {
          let materiaDoc = doc(this.firebase, "MateriasPrimas", materia.id);
          const nuevaCantidad = materia.existencias - materia.cantidadausar

          updateDoc(materiaDoc, { Existencias: nuevaCantidad }).then(() => {
            console.log('Inventario actualizado en: ', materia.nombre)
          }).catch((error) => {
            Swal.fire('Error', 'Error al actualizar inventario', 'error');
            console.error('Error al actualizar inventario', error)
          })
        })
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el producto', 'error');
        console.error("Error guardando producto: ", error);
      });

    let btnCerrar = document.getElementById('btnCerrarModalCrear');
    btnCerrar?.click();
  }

  EnviarProduccion(orden: OrdenesDeProduccion) {
    let ordenDoc = doc(this.firebase, "OrdenesProduccion", orden.Id_Orden);
    updateDoc(ordenDoc, { Estado: 'En produccion' }).then(() => {
      Swal.fire('Success', 'Produccion en curso', 'success')
    }).catch((error) => {
      Swal.fire('Error', 'Error al actualizar estado', 'error');
    })
  }

  FinalizarProduccion(orden: OrdenesDeProduccion) {
    let ordenDoc = doc(this.firebase, "OrdenesProduccion", orden.Id_Orden);
    updateDoc(ordenDoc, { Estado: 'Finalizada' }).then(() => {
      Swal.fire('Success', 'Orden finalizada', 'success')
    }).catch((error) => {
      Swal.fire('Error', 'Error al actualizar estado', 'error');
    })
  }


  EditarTablaProduccionEditar() {
    // Paso 1: Reseteamos 'cantidadausar' a cero en lugar de vaciar `ListaMateriasEditar`.
    this.ListaMateriasEditar.forEach((materia) => materia.cantidadausar = 0);

    // Paso 2: Recalculamos la cantidad de materias necesarias.
    for (let i = 0; i < this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.length; i++) {
      let cantidadProducto = this.OrdenProduccion.Cantidad_Producto[i];

      for (let j = 0; j < this.ProductosAgregadosOrdenProduccion.Producto_Elaborado[i].Materias_Primas.length; j++) {
        let materia = this.ProductosAgregadosOrdenProduccion.Producto_Elaborado[i].Materias_Primas[j];
        let cantidadMateria = this.ProductosAgregadosOrdenProduccion.Producto_Elaborado[i].Cantidad_MateriasPrimas[j];
        let cantidadTotalMateria = cantidadMateria * cantidadProducto;

        // Revisa si la materia ya existe en `ListaMateriasEditar`.
        let materiaExistente = this.ListaMateriasEditar.find(m => m.id === materia.Id_Materia);

        if (materiaExistente) {
          // Si ya existe, solo actualizamos 'cantidadausar'.
          materiaExistente.cantidadausar += cantidadTotalMateria;
        } else {
          // Si no existe, la agregamos a `ListaMateriasEditar`.
          this.ListaMateriasEditar.push({
            id: materia.Id_Materia,
            nombre: materia.Nombre,
            cantidadausar: cantidadTotalMateria,
            unidadmedida: '',
            precio: 0,         // Temporal, se actualizará con el valor de Firestore
            existencias: 0     // Temporal, se actualizará con el valor de Firestore
          });

          // Consultar los datos adicionales de Firestore solo para las nuevas materias.
          let q = query(this.MateriasBD, where("Id_Materia", "==", materia.Id_Materia));
          collectionData(q).subscribe((materiSnap) => {
            let item = this.ListaMateriasEditar.find(m => m.id === materia.Id_Materia);
            if (item) {
              item.precio = materiSnap[0].Precio_unitario;
              item.existencias = materiSnap[0].Existencias;
              item.unidadmedida = materiSnap[0].Unidad_Medida;
            }
          });
        }
      }
    }
  }

  actualizarPrecioEnOrdenProduccion(idMateria: string, nuevoPrecio: number) {
    // Recorre los productos en OrdenProduccion
    this.OrdenProduccion.Producto_Elaborado.forEach((producto) => {
      // Busca la materia prima que coincida por ID
      let materiaPrima = producto.Materias_Primas.find(materia => materia.Id_Materia === idMateria);
      if (materiaPrima) {
        // Actualiza el precio en OrdenProduccion
        materiaPrima.Precio_unitario = nuevoPrecio;
      }
    });

  }

  LimpiarListaMaterias() {
    this.ListaMateriasEditar = [];
  }

  LimpiarMenuCrear() {
    this.ProductosAgregadosOrdenProduccion.Producto_Elaborado = [];
    this.OrdenProduccion.Cantidad_Producto = [];
  }

  AgregarProductoProduccion(producto: Producto) {
    let ExisteProductoAgregado = this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.find(m => m.Id_Producto === producto.Id_Producto)

    if (!ExisteProductoAgregado) {
      this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.push(producto);
      this.OrdenProduccion.Cantidad_Producto.push(1);
      this.OrdenProduccion.Producto_Elaborado.push(producto);
    } else {
      Swal.fire('Error', 'Este producto ya ha sido agregado.', 'error');
    }

    this.EditarTablaProduccionEditar();
  }

  AgregarProductoEditar(producto: Producto) {
    let ExisteProductoAgregado = this.EditarProduccionModal.Producto_Elaborado.find(m => m.Id_Producto === producto.Id_Producto)

    if (!ExisteProductoAgregado) {
      // Agregar el producto a Producto_Elaborado
      this.EditarProduccionModal.Producto_Elaborado.push(producto);
      this.OrdenProduccion.Producto_Elaborado.push(producto);
    } else {
      Swal.fire('Error', 'Este producto ya ha sido agregado.', 'error');
    }
  }

  EliminarProductoEditarOrden(index: number) {
    this.EditarProduccionModal.Producto_Elaborado.splice(index, 1);
    this.EditarProduccionModal.Cantidad_Producto.splice(index, 1);
  }

  EliminarProductoOrden(index: number) {
    // Obtener el producto que se va a eliminar
    const productoEliminado = this.ProductosAgregadosOrdenProduccion.Producto_Elaborado[index];

    // Eliminar el producto y la cantidad de las listas correspondientes
    this.ProductosAgregadosOrdenProduccion.Producto_Elaborado.splice(index, 1);
    this.ProductosAgregadosOrdenProduccion.Cantidad_Producto.splice(index, 1);
    this.OrdenProduccion.Cantidad_Producto.splice(index, 1);
    this.OrdenProduccion.Producto_Elaborado.splice(index, 1);

    // Actualizar ListaMateriasEditar restando la cantidad de las materias correspondientes a este producto
    productoEliminado.Materias_Primas.forEach((materia, materiaIndex) => {
      const cantidadMateria = productoEliminado.Cantidad_MateriasPrimas[materiaIndex];
      const cantidadProducto = this.OrdenProduccion.Cantidad_Producto[index];

      // Encontrar la materia correspondiente en ListaMateriasEditar
      const materiaExistente = this.ListaMateriasEditar.find(m => m.id === materia.Id_Materia);

      if (materiaExistente) {
        // Restar la cantidad usada por este producto del total en ListaMateriasEditar
        materiaExistente.cantidadausar -= cantidadMateria * cantidadProducto;

        // Verificar si la cantidad llega a 0 y eliminar la materia si es el caso
        if (materiaExistente.cantidadausar <= 0) {
          this.ListaMateriasEditar = this.ListaMateriasEditar.filter(m => m.id !== materia.Id_Materia);
        }
      }
      // Reiniciar ListaMateriasEditar si queda vacía
      if (this.ListaMateriasEditar.length === 0) {
        this.ListaMateriasEditar = [];
      }
      else {
        this.ListaMateriasEditar.forEach(element => {
          if (element.cantidadausar === 0) {
            this.ListaMateriasEditar = [];
          }
        });
      }
      this.EditarTablaProduccionEditar();
    });
  }


  GuardarCambiosProduccion() {
    if (!this.EditarProduccionModal.Fecha_Elaboracion || !this.EditarProduccionModal.Fecha_Finalizacion || !this.EditarProduccionModal.Solicitante || !this.EditarProduccionModal.Producto_Elaborado || !this.EditarProduccionModal.Cantidad_Producto) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }

    let productoDoc = doc(this.firebase, "OrdenesProduccion", this.EditarProduccionModal.Id_Orden);
    setDoc(productoDoc, JSON.parse(JSON.stringify(this.EditarProduccionModal)))
      .then(() => {
        Swal.fire('Éxito', 'Orden actualizada correctamente', 'success');
        this.CargarProductos();
      })
      .catch((error) => {
        Swal.fire('Error', 'Ocurrió un error al actualizar la orden', 'error');
        console.error("Error actualizando orden: ", error);
      });
    let CerrarEditarModalProducto = document.getElementById("btnCerrarModalElementoEditar");
    CerrarEditarModalProducto?.click();
  }

  EliminarOrdenProduccion(orden: OrdenesDeProduccion) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const ordenRef = doc(this.firebase, 'OrdenesProduccion', orden.Id_Orden);
        deleteDoc(ordenRef)
          .then(() => {
            Swal.fire(
              'Eliminada',
              'La orden ha sido eliminada.',
              'success'
            );
          })
          .catch((error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la orden.',
              'error'
            );
          });


        /* El siguiente bloque de codigo debe lograr lo siguiente:
    
          -La cantidad total de materias usadas en crear la orden de produccion seran 
           devueltas al inventario dado que se cancelo la orden
    
           Para lograrlo debo primero saber que materias seran las que seran modificadas, 
           para ello debo obtener los id de las materias que debere modificar.
    
           Recorrere todos los productos de mi orden de produccion buscando las materias
           que se usaron en la elaboracion, dado que las mismas materias pueden ser usadas
           en distintos productos entonces habra materias iguales con diferentes cantidades,
           en esos casos sumare las cantidades de las materias cuando se encuentren coincidencias
    
    
        */
        this.MateriasUsadasDevueltas = []

        /* Para cada producto existente en mi orden de produccion buscare los id de las materias y los almacenare
        */
        orden.Producto_Elaborado.forEach((Producto, i) => {

          Producto.Materias_Primas.forEach((materia, j) => {
            let idMateria = materia.Id_Materia;
            let nombreMateria = materia.Nombre;
            let cantidadMateria = Producto.Cantidad_MateriasPrimas[j] * orden.Cantidad_Producto[i];

            let materiaExiste = this.MateriasUsadasDevueltas.find(m => m.id === materia.Id_Materia)

            if (materiaExiste) {
              materiaExiste.cantidad += cantidadMateria;
            } else {
              this.MateriasUsadasDevueltas.push({
                id: idMateria,
                nombre: nombreMateria,
                cantidad: cantidadMateria
              })
            }
          });
          console.log(this.MateriasUsadasDevueltas)
        });

        this.MateriasUsadasDevueltas.forEach((materia) => {
          const materiaDocRef = doc(this.firebase, "MateriasPrimas", materia.id);
          try {
            // Actualizar la cantidad en el campo `existencias` en Firestore usando `increment`
            updateDoc(materiaDocRef, {
              Existencias: increment(materia.cantidad)
            });
            console.log(`Inventario actualizado para ${materia.nombre}: +${materia.cantidad}`);
          } catch (error) {
            console.error(`Error al actualizar inventario de ${materia.nombre}:`, error);
          }
        });
      }
    });
  }

  MostrarDetalles(orden: OrdenesDeProduccion) {
    this.VerDetallesProduccion = orden;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  calcularCantidadMateria(producto: Producto, index: number, cantidadProducto: number): number {
    const materiaPrimaRatio = producto.Cantidad_MateriasPrimas[index] || 1;
    return cantidadProducto * materiaPrimaRatio; // Ahora utiliza la cantidad del índice específico
  }

  calcularCostoMateria(producto: Producto, index: number, cantidadProducto: number): number {
    const cantidadMateria = this.calcularCantidadMateria(producto, index, cantidadProducto);
    const costoUnitario = producto.Materias_Primas[index].Precio_unitario || 0; // Ajusta según tu estructura
    return cantidadMateria * costoUnitario; // Utiliza la cantidad de materia calculada
  }

  calcularCostoTotal(producto: Producto, cantidadProducto: number): number {
    return producto.Materias_Primas.reduce((total, _, indexMateria) => {
      return total + this.calcularCostoMateria(producto, indexMateria, cantidadProducto);
    }, 0);
  }

  getPrecioUnitario(materiaNombre: string): number {
    const producto = this.EditarProduccionModal?.Producto_Elaborado
      ?.find(producto => producto?.Materias_Primas?.some(m => m?.Nombre === materiaNombre));

    return producto?.Materias_Primas?.find(m => m?.Nombre === materiaNombre)?.Precio_unitario || 0;
  }

  GenerateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  resetForm() {
    this.OrdenProduccion = new OrdenesDeProduccion();
  }

  RestablecerListaCompleta() {
    this.ListaOrdenes = [...this.ListaOrdenesOriginales];
  }

  BuscarProduccion() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.RestablecerListaCompleta();
    } else {
      this.FiltrarOrdenesPorFecha(this.fechaInicio, this.fechaFin);
    }
  }
}
