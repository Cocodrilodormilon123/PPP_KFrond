import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.role || null;
    }
    return null;
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.sub || null;
    }
    return null;
  }
}
