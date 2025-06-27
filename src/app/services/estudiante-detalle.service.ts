import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteDetalleService {
  constructor(private http: HttpClient) {}

  buscarEstudiantePorCodigo(codigo: string): Observable<any> {
    return this.http.get(`/persona-ms/personas/codigo/${codigo}`);
  }

  obtenerPracticaPorPersona(idPersona: number): Observable<any> {
    return this.http.get(`/practica-ms/practicas/persona/${idPersona}`);
  }

  obtenerEvidencias(idPractica: number): Observable<any[]> {
    return this.http.get<any[]>(`/practica-ms/evidencias/practica/${idPractica}`);
  }

  subirEvidencia(formData: FormData): Observable<any> {
    return this.http.post(`/practica-ms/evidencias`, formData);
  }
}
