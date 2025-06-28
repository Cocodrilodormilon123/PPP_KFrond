import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvidenciaService {
  private baseUrl = 'http://localhost:4040/practica-ms/practicaspp/evidencias';

  constructor(private http: HttpClient) {}

  getByPracticaId(idPractica: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/practica/${idPractica}`);
  }

  subirEvidencia(idPractica: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar/${idPractica}`, formData);
  }
}