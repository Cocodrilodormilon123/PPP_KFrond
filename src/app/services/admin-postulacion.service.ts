import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPostulacionService {
  private baseUrl = 'http://localhost:4040/oferta-ms/postulaciones';
  private vacantesUrl = 'http://localhost:4040/oferta-ms/vacantes';
  private personaUrl = 'http://localhost:4040/persona-ms/personas';
  private baseUrlDocumentos = 'http://localhost:4040/oferta-ms/documento-postulacion';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todas las postulaciones (usado por el panel admin)
  getAllPostulaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Método restaurado para compatibilidad con componentes existentes
  actualizarEstado(id: number, estado: string, comentario?: string): Observable<any> {
    let url = `${this.baseUrl}/${id}/estado?estado=${estado}`;
    if (comentario && comentario.trim() !== '') {
      url += `&comentario=${encodeURIComponent(comentario)}`;
    }
    return this.http.put(url, {}, { headers: this.getAuthHeaders() });
  }

  // ACEPTAR documento
  aceptarDocumento(idPostulacion: number): Observable<any> {
    const url = `${this.baseUrlDocumentos}/aceptar/${idPostulacion}`;
    return this.http.put(url, {}, { headers: this.getAuthHeaders() });
  }

  // RECHAZAR documento con comentario
  rechazarDocumento(idPostulacion: number, comentario: string): Observable<any> {
    const url = `${this.baseUrlDocumentos}/rechazar/${idPostulacion}?comentario=${encodeURIComponent(comentario)}`;
    return this.http.put(url, {}, { headers: this.getAuthHeaders() });
  }

  // Obtener persona (estudiante)
  getPersonaPorId(idPersona: number): Observable<any> {
    return this.http.get(`${this.personaUrl}/${idPersona}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener documento asociado
  getDocumentoPorPostulacion(idPostulacion: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrlDocumentos}/${idPostulacion}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Ver archivo PDF
  verDocumento(nombreArchivo: string): Observable<Blob> {
    return this.http.get(`${this.baseUrlDocumentos}/archivo/${nombreArchivo}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  // Vacantes por oferta
  obtenerVacantesPorOferta(ofertaId: number): Observable<any> {
    return this.http.get<any>(`${this.vacantesUrl}/oferta/${ofertaId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Aumentar cupo
  incrementarCupo(ofertaId: number): Observable<any> {
    return this.http.put(`${this.vacantesUrl}/oferta/${ofertaId}/incrementar`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Reducir cupo
  reducirCupo(ofertaId: number): Observable<any> {
    return this.http.put(`${this.vacantesUrl}/oferta/${ofertaId}/reducir`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Postulantes únicos con detalle
  obtenerPostulantesUnicosDetallado(idOferta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/oferta/${idOferta}/postulantes-unicos-detallado`, {
      headers: this.getAuthHeaders()
    });
  }
}
