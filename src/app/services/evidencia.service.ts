import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvidenciaService {
  private baseUrl = 'http://localhost:4040/practica-ms/practicaspp/evidencias';
  private guiaURL = 'http://localhost:4040/practica-ms/guia_subida_evidencias.pdf';
  private descargarURL = 'http://localhost:4040/practica-ms/practicaspp/evidencias/descargar';

  constructor(private http: HttpClient) {}

  getByPracticaId(idPractica: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/practica/${idPractica}`);
  }

  subirEvidencia(idPractica: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar/${idPractica}`, formData);
  }

  descargarGuiaPDF(): void {
    const token = localStorage.getItem('accessToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(this.guiaURL, { headers, responseType: 'blob' }).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'guia_subida_evidencias.pdf';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Error al descargar la guía', err);
        alert('No se pudo descargar la guía de evidencias');
      }
    });
  }

  descargarEvidencia(nombreArchivo: string): void {
    const token = localStorage.getItem('accessToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${this.descargarURL}/${nombreArchivo}`, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: err => {
        console.error('Error al abrir evidencia', err);
        alert('No se pudo abrir la evidencia');
      }
    });
  }
}
