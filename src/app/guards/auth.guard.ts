import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  private validarAcceso(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No hay token');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      console.log('Token decodificado:', decoded);

      if (decoded.exp && decoded.exp < now) {
        console.warn('Token expirado');
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
        return false;
      }

      const expectedRole = route.data['role'];
      const actualRole = decoded.role;

      console.log('Rol esperado:', expectedRole, '| Rol del token:', actualRole);

      // Compara ignorando mayúsculas/minúsculas
      if (expectedRole && actualRole?.toUpperCase() !== expectedRole?.toUpperCase()) {
        console.warn('Rol no coincide');
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const finalRoute = route.firstChild ? route.firstChild : route;
    return this.validarAcceso(finalRoute);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.validarAcceso(childRoute);
  }
}
