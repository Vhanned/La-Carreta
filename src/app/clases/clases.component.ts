export class Queso {
  
  constructor (){

  }

  NombreQueso:string='';
  

}

export class Usuarios{
  
  constructor(){

  }

  NombreUsuario:string='';
  Contrasena:string='';
  Rol:string='';

  setData(data:any){
    this.NombreUsuario = data.Usuario;
    this.Contrasena = data.Contrasena;
    this.Rol = data.Rol;
    }

}