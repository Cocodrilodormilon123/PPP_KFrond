import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteDetalleService {
  private baseUrl = 'http://localhost:4040';
  private personaUrl = `${this.baseUrl}/persona-ms/personas`;
  private practicaUrl = `${this.baseUrl}/practica-ms/practicas`;
  private evidenciaUrl = `${this.baseUrl}/practica-ms/practicaspp/evidencias`;

  constructor(private http: HttpClient) {}

  buscarEstudiantePorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.personaUrl}/codigo/${codigo}`);
  }

  obtenerPracticaPorPersona(idPersona: number): Observable<any> {
    return this.http.get(`${this.practicaUrl}/persona/${idPersona}`);
  }

  obtenerDetallePractica(idPractica: number): Observable<any> {
    return this.http.get(`${this.practicaUrl}/detalle/${idPractica}`);
  }

  obtenerEvidencias(idPractica: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.evidenciaUrl}/practica/${idPractica}`);
  }

  verFoto(nombreArchivo: string): Observable<Blob> {
    const token = localStorage.getItem('accessToken') || '';
    return this.http.get(`${this.personaUrl}/img/${nombreArchivo}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      responseType: 'blob'
    });
  }

  verArchivo(nombreArchivo: string): Observable<Blob> {
    const token = localStorage.getItem('accessToken') || '';
    return this.http.get(`${this.evidenciaUrl}/descargar/${nombreArchivo}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      responseType: 'blob'
    });
  }

  getUrlDescarga(nombreArchivo: string): string {
    return `${this.evidenciaUrl}/descargar/${nombreArchivo}`;
  }
}
