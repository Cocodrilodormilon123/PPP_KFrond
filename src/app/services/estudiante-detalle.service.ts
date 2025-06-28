import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteDetalleService {
  private baseUrl = 'http://localhost:4040';

  constructor(private http: HttpClient) {}

  buscarEstudiantePorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/persona-ms/personas/codigo/${codigo}`);
  }

  obtenerPracticaPorPersona(idPersona: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/practica-ms/practicas/persona/${idPersona}`);
  }

  obtenerDetallePractica(idPractica: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/practica-ms/practicas/detalle/${idPractica}`);
  }

  obtenerEvidencias(idPractica: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/practica-ms/practicaspp/evidencias/practica/${idPractica}`);
  }

  verFoto(nombreArchivo: string): Observable<Blob> {
    const token = localStorage.getItem('accessToken') || '';
    return this.http.get(`${this.baseUrl}/persona-ms/personas/img/${nombreArchivo}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    });
  }
  verArchivo(nombreArchivo: string): Observable<Blob> {
    const token = localStorage.getItem('accessToken') || '';
    return this.http.get(`${this.baseUrl}/practica-ms/practicaspp/evidencias/descargar/${nombreArchivo}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    });
  }
}
