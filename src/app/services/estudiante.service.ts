import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private baseUrl = '/persona-ms/personas'; // Uso de proxy

  constructor(private http: HttpClient) {}

  registrarEstudiante(persona: any, archivo: File): Observable<any> {
    const formData = new FormData();
    const personaBlob = new Blob([JSON.stringify(persona)], {
      type: 'application/json'
    });

    formData.append('persona', personaBlob);
    formData.append('file', archivo);

    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post(this.baseUrl, formData, { headers });
  }
}
