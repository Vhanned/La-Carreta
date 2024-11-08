// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  // Método para iniciar sesión
  login() {
    localStorage.setItem('user', 'true'); // Puedes almacenar información relevante del usuario si es necesario
    this.loggedIn.next(true);
  }

  // Método para cerrar sesión
  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['login'], { replaceUrl: true }).then(() => {
      window.location.reload(); // Forzar recarga de la página
    });
  }

  // Método para verificar si el usuario está logueado
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Verificar si existe un token de sesión
  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }
}
