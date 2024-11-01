export class Producto {

  constructor() {
    this.Estado = "Activo";
  }

  toPlain() {
    return {
      Id_Producto: this.Id_Producto,
      Codigo: this.Codigo,
      Nombre: this.Nombre,
      Elaboracion: this.Elaboracion,
      Tipo_Empaquetado: this.Tipo_Empaquetado,
      Costo: this.Costo,
      Tamano_Lote: this.Tamano_Lote,
      Estado: this.Estado,
      Materias_Primas: this.Materias_Primas,
      Cantidad_MateriasPrimas: this.Cantidad_MateriasPrimas,
      Litros: this.Litros,
      Tiempo_Elaboracion: this.Tiempo_Elaboracion,
    };
  }

  Id_Producto: string = ''; // ID único del producto
  Codigo: string = ''; //Identificador visible al usuario
  Nombre: string = ''; // Nombre del producto
  Elaboracion: string = ''; //Proceso de elaboracion, a manera de instructivo
  Tipo_Empaquetado: string = ''; // Tipo de producto (por ejemplo, queso fresco, queso madurado)
  Costo: number | undefined = undefined; // Costo de producción del producto por lote
  Tamano_Lote: number | undefined = undefined;
  Estado: string=''; // Indica si el producto está disponible para producción
  Materias_Primas: MateriaPrima[] = []; // Lista de materias primas necesarias para producir este producto
  Cantidad_MateriasPrimas: number[] = []; //Que tanto se va a usar de cada materia prima
  Litros: number | undefined = undefined; //litros necesarios para la elaboracion de cada lote
  Tiempo_Elaboracion: string = '';

  setData(data: any) {
    this.Id_Producto = data.Id_Producto || '';
    this.Codigo = data.Codigo || '';
    this.Nombre = data.Nombre || '';
    this.Elaboracion = data.Elaboracion || '';
    this.Tipo_Empaquetado = data.Tipo_Empaquetado || '';
    this.Costo = data.Costo || undefined;
    this.Tamano_Lote = data.Tamano_Lote || undefined;
    this.Estado = data.Estado || '';
    this.Materias_Primas = data.Materias_Primas || [];
    this.Cantidad_MateriasPrimas = data.Cantidad_MateriasPrimas || [];
    this.Litros = data.Litros || undefined;
    this.Tiempo_Elaboracion = data.Tiempo_Elaboracion || '';
  }

}

//Materias primas
export class MateriaPrima {

  constructor() {

  }

  Id_Materia: string = ''; // ID único de la materia prima
  Codigo: string = '';
  Nombre: string = ''; // Nombre de la materia prima (ej. "Caseína", "Leche Fluida")
  Unidad_Medida: string = ''; // Unidad de medida (litros, kilogramos, etc.)
  Existencias: number | undefined = undefined; //Registro de cuando se agrega, en dado caso seria en una nueva coleccion
  Marca: string = '';
  Tipo: string = '';
  Precio_unitario: number | undefined = undefined;//Costo de la materia prima, sera un valor por defecto el cual podran editar en el reporte del dia en caso de ser necesario
  Punto_Reorden: number | undefined = undefined; //Cuando el inventario es menor que el punto de reorden, aparece una alerta

  setData(data: any) {
    this.Id_Materia = data.Id_Materia || '';
    this.Codigo = data.Codigo || '';
    this.Nombre = data.Nombre || '';
    this.Unidad_Medida = data.Unidad_Medida || '';
    this.Marca = data.Marca || '';
    this.Existencias = data.Existencias || '';
    this.Tipo = data.Tipo || '';
    this.Precio_unitario = data.Precio_unitario || '';
    this.Punto_Reorden = data.Punto_Reorden || undefined;
  }

}

//Solicitudes de materias primas
export class OrdenesDeProduccion {

  constructor() {

  }
  Id_Orden: string = ''; // ID único de la solicitud
  Producto_Elaborado: Producto[] = []; // Lista de productos agregados
  Cantidad_Producto: number[] = []; // Cantidad del producto que se va a elaborar
  Fecha_Elaboracion: string = ''; // Fecha cuando se generó la receta
  Fecha_Entrega_Materia: string = ''; 
  Fecha_Entrega_Materia_Number: number | undefined = undefined;
  Fecha_Finalizacion: string = ''; // Fecha cuando se terminó la orden de producción
  Solicitante: string = '';
  Estado: string = ''; // Estado de la receta
  Usuario_Elaboracion: string = ''; // Cambiado a la ortografía correcta
  Tiempo_elaboracion_total: string = '';
  Clave_Lote: string = '';
  Fecha_Creacion: string = '';

  setData(data: any) {
    this.Id_Orden = data.Id_Orden || '';
    this.Producto_Elaborado = data.Producto_Elaborado || [];
    this.Cantidad_Producto = data.Cantidad_Producto || [];
    this.Fecha_Elaboracion = data.Fecha_Elaboracion || ''; // Cambiado a la ortografía correcta
    this.Fecha_Entrega_Materia = data.Fecha_Entrega_Materia || '';
    this.Fecha_Entrega_Materia_Number = data.Fecha_Entrega_Materia_Number || undefined;
    this.Fecha_Finalizacion = data.Fecha_Finalizacion || '';
    this.Solicitante = data.Solicitante || '';
    this.Estado = data.Estado || '';
    this.Usuario_Elaboracion = data.Usuario_Elaboracion || ''; // Cambiado a la ortografía correcta
    this.Tiempo_elaboracion_total = data.Tiempo_elaboracion_total || '';
    this.Clave_Lote = data.Clave_Lote || '';
  }

}

//Inventario de materias primas
export class InventarioMateriasPrimas {

  constructor() {

  }

  Id_Inventario: string = ''; // ID único del inventario
  Id_Materia: string = ''; // ID de la materia prima
  Nombre_Materia: string = '';
  Unidad_Medida: number | undefined = undefined;
  Cantidad: number | undefined = undefined; // Cantidad disponible en el inventario
  Fecha_Actualizacion: string = ''; // Fecha de la última actualización del inventario
  Fecha_Actualizacion_Number: number | undefined = undefined;
  Punto_Reorden: number | undefined = undefined; //Cantidad minima que se puede tener de materia antes de hacer otro pedido

  setData(data: any) {
    this.Id_Inventario = data.Id_Inventario || '';
    this.Id_Materia = data.Id_Materia || '';
    this.Nombre_Materia = data.Nombre_Materia || '';
    this.Unidad_Medida = data.Unidad_Medida || undefined;
    this.Cantidad = data.Cantidad || undefined;
    this.Fecha_Actualizacion = data.Fecha_Actualizacion || '';
    this.Fecha_Actualizacion_Number = data.Fecha_Actualizacion_Number || undefined;
    this.Punto_Reorden = data.Punto_Reorden || undefined;
  }

}

//Tinas de producción
export class TinaProduccion {

  constructor() {

  }

  Id_Tina: string = ''; // ID único de la tina
  Nombre_Tina: string = '';
  Capacidad: number | undefined = undefined; // Tipo de tina (ejemplo: "tina grande", "tina pequeña")

  setData(data: any) {
    this.Id_Tina = data.Id_Tina || '';
    this.Nombre_Tina = data.Nombre_Tina || '';
    this.Capacidad = data.Capacidad || undefined;
  }

}

//Ventas
export class Venta {

  constructor() {

  }

  Id_Venta: string = ''; // ID único de la venta
  Id_Cliente: string = ''; // ID del cliente (en caso de ser necesario)
  Id_Producto: string = ''; // ID del producto vendido
  Vantidad_Vendida: number | undefined = undefined; // Cantidad vendida del producto
  Precio: number | undefined = undefined; // Precio de la venta
  Satisfaccion_Cliente: number | undefined = undefined; // Nivel de satisfacción del cliente (escala del 1 al 5)
  Comentarios: string = ''; // Comentarios del cliente sobre la venta

  setData(data: any) {
    this.Id_Venta = data.Id_Venta || '';
    this.Id_Cliente = data.Id_Cliente || '';
    this.Id_Producto = data.Id_Producto || '';
    this.Vantidad_Vendida = data.Vantidad_Vendida || undefined;
    this.Precio = data.Precio || undefined;
    this.Satisfaccion_Cliente = data.Satisfaccion_Cliente || undefined;
    this.Comentarios = data.Comentarios || '';
  }

}

export class InventarioProductos {

  constructor() {

  }

  Id_producto: string = '';
  Nombre_Producto: string = '';
  Cantidad: number | undefined = undefined;
  Fecha_LoteMasAntiguo: string = '';
  Fecha_UltimoLote: string = '';
  Fecha_LoteMasAntiguo_Number: number | undefined = undefined;
  Fecha_UltimoLote_Number: number | undefined = undefined;
  Id_RectetaMasAntigua: string = '';
  Id_RecetaMasReciente: string = '';

  setData(data: any) {
    this.Id_producto = data.Id_producto || '';
    this.Nombre_Producto = data.Nombre_Producto || '';
    this.Cantidad = data.Cantidad || undefined;
    this.Fecha_LoteMasAntiguo = data.Fecha_LoteMasAntiguo || '';
    this.Fecha_UltimoLote = data.Fecha_UltimoLote || '';
    this.Fecha_LoteMasAntiguo_Number = data.Fecha_LoteMasAntiguo_Number || undefined;
    this.Fecha_UltimoLote_Number = data.Fecha_UltimoLote_Number || undefined;
    this.Id_RectetaMasAntigua = data.Id_RectetaMasAntigua || '';
    this.Id_RecetaMasReciente = data.Id_RecetaMasReciente || '';
  }

}

export class Usuarios {

  constructor() {

  }

  NombreUsuario: string = '';
  Contrasena: string = '';
  Rol: string = '';

  setData(data: any) {
    this.NombreUsuario = data.Usuario;
    this.Contrasena = data.Contrasena;
    this.Rol = data.Rol;
  }

}