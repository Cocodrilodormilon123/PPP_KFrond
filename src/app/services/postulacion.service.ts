import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private baseUrl = 'http://localhost:4040/oferta-ms/postulaciones';
  private baseUrl2 = 'http://localhost:4040/oferta-ms/documento-postulacion';

  constructor(private http: HttpClient) {}

  postular(postulacion: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.baseUrl, postulacion, { headers });
  }

  getPostulacionesByPersona(idPersona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/persona/${idPersona}`);
  }

  getAllPostulaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/estado?estado=${estado}`, {});
  }

  getDocumentoByPostulacion(idPostulacion: number): Observable<any> {
    return this.http.get(`${this.baseUrl2}/${idPostulacion}`);
  }

  actualizarEstadoDocumento(id: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.baseUrl2}/${id}/estado?nuevoEstado=${nuevoEstado}`, {});
  }

  descargarPlantilla(idPostulacion: number): Observable<Blob> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl2}/descargar-plantilla/${idPostulacion}`, {
      headers,
      responseType: 'blob'
    });
  }

  subirArchivo(url: string, data: FormData): Observable<any> {
    return this.http.post(url, data);
  }

  verDocumento(nombreArchivo: string): Observable<Blob> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`http://localhost:4040/oferta-ms/documento-postulacion/archivo/${nombreArchivo}`, {
      headers,
      responseType: 'blob'
    });
  }
}
