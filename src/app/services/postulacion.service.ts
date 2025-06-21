import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private baseUrl = 'http://localhost:4040/postulacion-ms/postulaciones';

  constructor(private http: HttpClient) {}

  getPostulacionesByPersona(idPersona: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/persona/${idPersona}`);
  }
}
