import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private apiUrl = '/oferta-ms';

  constructor(private http: HttpClient) {}

  getOfertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ofertas`);
  }

  getVacantesPorOferta(idOferta: number): Promise<any> {
    return lastValueFrom(this.http.get<any>(`${this.apiUrl}/vacantes/oferta/${idOferta}`));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
