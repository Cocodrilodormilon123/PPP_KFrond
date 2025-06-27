import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  private apiUrl = '/oferta-ms';

  constructor(private http: HttpClient) {}

  getPostulaciones(idPersona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/postulaciones/estudiante/${idPersona}`, {
      headers: this.getAuthHeaders()
    });
  }

  getOfertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ofertas`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
}
