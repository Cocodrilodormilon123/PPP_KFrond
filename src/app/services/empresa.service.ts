import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private baseUrl = '/oferta-ms/empresas'; // ← Proxy en uso

  constructor(private http: HttpClient) {}

  listarEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  registrarEmpresa(empresa: any): Observable<any> {
    return this.http.post(this.baseUrl, empresa);
  }

  // Si más adelante quieres editar empresas:
  actualizarEmpresa(id: number, empresa: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, empresa);
  }
}
