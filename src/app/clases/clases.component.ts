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
  Estado: string = ''; // Indica si el producto está disponible para producción
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
  Fecha_Finalizacion: string = ''; // Fecha cuando se terminó la orden de producción
  Solicitante: string = '';
  Estado: string = ''; // Estado de la receta
  Tiempo_elaboracion_total: string = '';
  Clave_Lote: string = '';
  Fecha_Creacion: string = '';

  setData(data: any) {
    this.Id_Orden = data.Id_Orden || '';
    this.Producto_Elaborado = data.Producto_Elaborado || [];
    this.Cantidad_Producto = data.Cantidad_Producto || [];
    this.Fecha_Creacion = data.Fecha_Creacion || '';
    this.Fecha_Elaboracion = data.Fecha_Elaboracion || ''; // Cambiado a la ortografía correcta
    this.Fecha_Finalizacion = data.Fecha_Finalizacion || '';
    this.Solicitante = data.Solicitante || '';
    this.Estado = data.Estado || '';
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


//Ventas
export class Venta {

  constructor() {

  }

  Id_Venta: string = ''; // ID único de la venta
  Id_Cliente: string = ''; // ID del cliente (en caso de ser necesario)
  Id_Producto: string = ''; // ID del producto vendido
  Cantidad_Vendida: number | undefined = undefined; // Cantidad vendida del producto
  Precio: number | undefined = undefined; // Precio de la venta
  Satisfaccion_Cliente: number | undefined = undefined; // Nivel de satisfacción del cliente (escala del 1 al 5)
  Comentarios: string = ''; // Comentarios del cliente sobre la venta

  setData(data: any) {
    this.Id_Venta = data.Id_Venta || '';
    this.Id_Cliente = data.Id_Cliente || '';
    this.Id_Producto = data.Id_Producto || '';
    this.Cantidad_Vendida = data.Vantidad_Vendida || undefined;
    this.Precio = data.Precio || undefined;
    this.Satisfaccion_Cliente = data.Satisfaccion_Cliente || undefined;
    this.Comentarios = data.Comentarios || '';
  }

}

export class InventarioProductos {

  constructor() {

  }

  Id_producto: string = '';
  Codigo: string = '';
  Nombre_Producto: string = '';
  Cantidad: number | undefined = undefined;
  Precio: number | undefined = undefined;


  setData(data: any) {
    this.Id_producto = data.Id_producto || '';
    this.Nombre_Producto = data.Nombre_Producto || '';
    this.Cantidad = data.Cantidad || undefined;
    this.Precio = data.Precio || undefined;
    this.Codigo = data.Codigo || '';
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

export class AdContable {

  constructor() {

  }

  Id_Registro: string = '';
  anticipoProveedor: number | undefined;
  cuentasPorPagar: number | undefined;
  fecha: string = '';
  gastosGenerales: number | undefined;
  otrosGastos: number | undefined;
  pagoProveedoresBanco: number | undefined;
  pagoProveedoresCreditoBanco: number | undefined;
  pagoProveedoresCreditoEfectivo: number | undefined;
  pagoProveedoresEfectivo: number | undefined;

  setData(data: any) {
    this.Id_Registro = data.Id_Registro || '';
    this.anticipoProveedor = data.anticipoProveedor || undefined;
    this.cuentasPorPagar = data.cuentasPorPagar || undefined;
    this.fecha = data.fecha || '';
    this.gastosGenerales = data.gastosGenerales || undefined;
    this.otrosGastos = data.otrosGastos || undefined;
    this.pagoProveedoresBanco = data.pagoProveedoresBanco || undefined;
    this.pagoProveedoresCreditoBanco = data.pagoProveedoresCreditoBanco || undefined;
    this.pagoProveedoresCreditoEfectivo = data.pagoProveedoresCreditoEfectivo || undefined;
    this.pagoProveedoresEfectivo = data.pagoProveedoresEfectivo || undefined;
  }

}

export class Finanzas {

  constructor() {

  }

  Id_Reporte: string = '';
  comprasInversion: string = '';
  fecha: string = '';
  gastos: number | undefined = undefined;
  gastosBanco: number | undefined = undefined;
  gastosEfectivos: number | undefined = undefined;
  mpBanco: number | undefined = undefined;
  mpCajaChica: number | undefined = undefined;

  setData(data: any) {
    this.Id_Reporte = data.Id_Reporte||'';
    this.comprasInversion = data.comprasInversion;
    this.fecha = data.fecha;
    this.gastos = data.gastos;
    this.gastosBanco = data.gastosBanco;
    this.gastosEfectivos = data.gastosEfectivos;
    this.mpBanco = data.mpBanco;
    this.mpCajaChica = data.mpCajaChica;
  }
}

export class Ventas {

  constructor() {

  }

  Id_Venta: string = '';
  cobranzaBanco: number | undefined = undefined;
  cobranzaEfectivo: number | undefined = undefined;
  compraProductos: number | undefined = undefined;
  cuentasCobrar: number | undefined = undefined;
  fecha: string = '';
  inventarios: number | undefined = undefined;
  ventaContado: number | undefined = undefined;

  setData(data: any) {
    this.Id_Venta = data.Id_Venta || '';
    this.cobranzaBanco = data.cobranzaBanco || undefined;
    this.cobranzaEfectivo = data.cobranzaEfectivo || undefined;
    this.compraProductos = data.compraProductos || undefined;
    this.cuentasCobrar = data.cuentasCobrar || undefined;
    this.fecha = data.fecha || '';
    this.inventarios = data.inventarios || undefined;
    this.ventaContado = data.ventaContado || undefined;
  }
}

export class Produccion {

  constructor() {

  }

  CompraMateriaPrimaContado: number | undefined;
  CompraMateriaPrimaCredito: number | undefined;
  InventarioMateriaPrima: number | undefined;
  MateriaPrimaProductoTerminado: number | undefined;
  InventarioProductoTerminado: number | undefined;
  ProductoEnProcesoTerminado: number | undefined;
  ProductoEnProceso: number | undefined;

  setData(data:any){
    this.CompraMateriaPrimaContado = data.CompraMateriaPrimaContado || undefined;
    this.CompraMateriaPrimaCredito = data.CompraMateriaPrimaCredito || undefined;
    this.InventarioMateriaPrima = data.InventarioMateriaPrima || undefined;
    this.MateriaPrimaProductoTerminado = data.MateriaPrimaProductoTerminado || undefined;
    this.InventarioProductoTerminado = data.InventarioProductoTerminado || undefined;
    this.ProductoEnProcesoTerminado = data.ProductoEnProcesoTerminado || undefined;
    this.ProductoEnProceso = data.ProductoEnProceso || undefined;
  }

}

export class SalidaProducto {

  constructor() {

  }

  Id_RegistroSalida: string = '';
  ProductoSalida: string = '';
  Id_ProductoSalida: string = '';
  Precio: number | undefined;
  CantidadSalida: number | undefined;
  FechaSalida: string = '';

  setData(data: any) {
    this.Id_RegistroSalida = data.Id_RegistroSalida || '';
    this.ProductoSalida = data.ProductoSalida || '';
    this.CantidadSalida = data.CantidadSalida || undefined;
    this.Id_ProductoSalida = data.Id_ProductoSalida || '';
    this.Precio = data.Precio || undefined;
    this.FechaSalida = data.FechaSalida || '';
  }

}

export interface MateriaPrimaInfo {
  id: string;
  nombre: string;
  cantidadausar: number;
  unidadmedida: string;
  precio: number; // Se llenará después de la consulta a Firestore
  existencias: number; // Se llenará después de la consulta a Firestore
}


export interface MateriaPrimaUsadaOrden {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface CostoOrden {
  id: string;
  costo: number;
}

