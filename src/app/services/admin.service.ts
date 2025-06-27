import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = '/persona-ms/personas';

  constructor(private http: HttpClient) {}

  registrarAdmin(adminData: any, archivo: File): Observable<any> {
    const formData = new FormData();
    const payload = new Blob([JSON.stringify(adminData)], {
      type: 'application/json'
    });

    formData.append('persona', payload);
    formData.append('file', archivo);

    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post(this.baseUrl, formData, { headers });
  }
}
