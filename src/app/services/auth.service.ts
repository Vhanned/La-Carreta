// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['login'], { replaceUrl: true }).then(() => {
      window.location.reload(); // Forzar recarga de la página
    });
  }
  
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
