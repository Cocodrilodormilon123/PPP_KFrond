import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private baseUrl = 'http://localhost:4040/oferta-ms/postulaciones';
  private baseUrl2 = 'http://localhost:4040/oferta-ms/documento-postulacion';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener postulaciones por persona (estudiante)
  getPostulacionesByPersona(idPersona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/persona/${idPersona}`);
  }

  // 🔹 Obtener todas las postulaciones (para admin)
  getAllPostulaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // 🔹 Cambiar estado de la postulación (PENDIENTE → EN_REVISION, RECHAZADA)
  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/estado?estado=${estado}`, {});
  }

  // 🔹 Obtener documento por ID de postulación
  getDocumentoByPostulacion(idPostulacion: number): Observable<any> {
    return this.http.get(`${this.baseUrl2}/${idPostulacion}`);
  }

  // 🔹 Cambiar estado del documento (ACEPTADO / RECHAZADO)
  actualizarEstadoDocumento(id: number, nuevoEstado: string): Observable<any> {
    const url = `${this.baseUrl2}/${id}/estado?nuevoEstado=${nuevoEstado}`;
    return this.http.put(url, {});
  }

  descargarPlantilla(idPostulacion: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl2}/descargar-plantilla/${idPostulacion}`;
    return this.http.get(url, { headers, responseType: 'blob' });
  }

  subirArchivo(url: string, data: FormData): Observable<any> {
    return this.http.post(url, data);
  }

  verDocumento(nombreArchivo: string): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:4040/oferta-ms/documento-postulacion/archivo/${nombreArchivo}`;
    return this.http.get(url, { headers, responseType: 'blob' });
  }
}
