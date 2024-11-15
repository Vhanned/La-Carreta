// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<string>(this.getUserRole());

  constructor(private router: Router) {}

  login(role: string) {
    localStorage.setItem('user', 'true');
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
    this.userRole.next(role);
  }

  logout() {
    this.loggedIn.next(false);
    this.userRole.next('');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['login'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getUserRole() {
    return localStorage.getItem('role') || '';
  }

  hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  getRoleObservable() {
    return this.userRole.asObservable();
  }
}
