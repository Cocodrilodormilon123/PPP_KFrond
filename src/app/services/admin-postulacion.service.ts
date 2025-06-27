import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPostulacionService {
  private baseUrl = '/oferta-ms/postulaciones';

  constructor(private http: HttpClient) {}

  obtenerPostulantesUnicosDetallado(ofertaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/oferta/${ofertaId}/postulantes-unicos-detallado`);
  }

  actualizarEstado(id: number, estado: string, comentario?: string): Observable<any> {
    let url = `${this.baseUrl}/${id}/estado?estado=${estado}`;
    if (comentario && comentario.trim() !== '') {
      url += `&comentario=${encodeURIComponent(comentario)}`;
    }
    return this.http.put(url, {});
  }
}
