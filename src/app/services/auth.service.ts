// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4040/auth-server/auth';

  constructor(private http: HttpClient) {}

  login(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  changePassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      username,
      oldPassword,
      newPassword
    };

    return this.http.post(`${this.baseUrl}/change-password`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
