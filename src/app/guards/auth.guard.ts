import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  private validarAcceso(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
        return false;
      }

      const expectedRole = route.data['role'];
      if (expectedRole && decoded.role !== expectedRole) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.validarAcceso(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.validarAcceso(childRoute);
  }
}
