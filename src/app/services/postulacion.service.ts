import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private baseUrl = 'http://localhost:4040/oferta-ms/postulaciones';
  private docBaseUrl = 'http://localhost:4040/oferta-ms/documento-postulacion';
  private ofertaBaseUrl = 'http://localhost:4040/oferta-ms/ofertas';
  private practicaBaseUrl = 'http://localhost:4040/practica-ms/practicas';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  postular(postulacion: any): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.baseUrl, postulacion, { headers });
  }

  getPostulacionesByPersona(idPersona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/persona/${idPersona}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllPostulaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/estado?estado=${estado}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  getDocumentoByPostulacion(idPostulacion: number): Observable<any> {
    return this.http.get(`${this.docBaseUrl}/${idPostulacion}`, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEstadoDocumento(id: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.docBaseUrl}/${id}/estado?nuevoEstado=${nuevoEstado}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  descargarPlantilla(idPostulacion: number): Observable<Blob> {
    return this.http.get(`${this.docBaseUrl}/descargar-plantilla/${idPostulacion}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  subirArchivo(idPostulacion: number, data: FormData): Observable<any> {
    return this.http.post(`${this.docBaseUrl}/${idPostulacion}/archivo`, data, {
      headers: this.getAuthHeaders()
    });
  }

  verDocumento(nombreArchivo: string): Observable<Blob> {
    return this.http.get(`${this.docBaseUrl}/archivo/${nombreArchivo}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  getOfertaById(idOferta: number): Observable<any> {
    return this.http.get(`${this.ofertaBaseUrl}/${idOferta}`, {
      headers: this.getAuthHeaders()
    });
  }

  verificarPracticaActiva(idPersona: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.practicaBaseUrl}/persona/${idPersona}/tiene-activa`);
  }
}
