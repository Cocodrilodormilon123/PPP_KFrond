import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  private readonly apiUrl = 'http://localhost:4040/oferta-ms';
  private readonly personaImgUrl = 'http://localhost:4040/persona-ms/img';

  constructor(private http: HttpClient) {}

  getPostulaciones(idPersona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/postulaciones/estudiante/${idPersona}`, {
      headers: this.getAuthHeaders()
    });
  }

  getOfertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ofertas`, {
      headers: this.getAuthHeaders()
    });
  }

  getFotoUrl(nombreFoto: string): string {
    return `${this.personaImgUrl}/${nombreFoto}`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
