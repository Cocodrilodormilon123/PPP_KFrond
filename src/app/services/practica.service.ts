import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PracticaService {
    private baseUrl = 'http://localhost:4040/practica-ms/practicas';

    constructor(private http: HttpClient) { }

    getDetallePorIdPersona(idPersona: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/detalle/estudiante/${idPersona}`);
}
}