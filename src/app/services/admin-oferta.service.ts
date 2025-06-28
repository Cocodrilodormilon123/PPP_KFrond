import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOfertaService {
  private apiUrl = '/oferta-ms';

  constructor(private http: HttpClient) {}

  getOfertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ofertas`);
  }

  getOfertasPorEstado(estado: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ofertas/estado/${estado}`);
  }

  getVacantesPorOferta(idOferta: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vacantes/oferta/${idOferta}`);
  }

  crearOferta(oferta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ofertas`, oferta, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarOferta(id: number, oferta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ofertas/${id}`, oferta, {
      headers: this.getAuthHeaders()
    });
  }

  asignarCupos(idOferta: number, cupos: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/vacantes/oferta/${idOferta}/cupos?total=${cupos}`, null, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerEmpresasActivas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empresas/estado/ACTIVA`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  actualizarEstadoOferta(id: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/ofertas/${id}/estado?estado=${nuevoEstado}`, null, {
      headers: this.getAuthHeaders()
    });
  }
}
