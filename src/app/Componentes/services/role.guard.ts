import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): Observable<boolean> | boolean {
    const expectedRole = route.data['role'];
    return this.authService.getRoleObservable().pipe(
      map(role => role === expectedRole),
      tap(hasAccess => {
        if (!hasAccess) {
          //alert('No tienes permiso para acceder a esta página.');
          this.router.navigate(['login'], { replaceUrl: true });
        }
      })
    );
  }
}
