import { Component, OnInit } from '@angular/core';
import { PracticaService } from '../../services/practica.service';
import { EvidenciaService } from '../../services/evidencia.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-practicas',
  templateUrl: './practicas.component.html',
  styleUrls: ['./practicas.component.css']
})
export class PracticasComponent implements OnInit {
  practica: any;
  evidencias: any[] = [];
  semanasDisponibles: number[] = [];
  archivoSeleccionado: File | null = null;
  semanaActual: number = 1;
  idPersona: number = 0;

  constructor(
    private practicaService: PracticaService,
    private evidenciaService: EvidenciaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('usuario');

    if (!userStr) {
      console.error('❌ No se encontró el usuario en localStorage');
      return;
    }

    try {
      const usuario = JSON.parse(userStr);
      if (usuario?.idPersona) {
        this.idPersona = usuario.idPersona;

        // ✅ Nuevo endpoint: obtener detalle completo
        this.practicaService.getDetallePorIdPersona(this.idPersona).subscribe(detalle => {
          this.practica = detalle;

          console.log('✅ Práctica (detalle completo) cargada:', this.practica);

          // ✅ Conversión de fecha (ya debería venir en ISO, pero por si acaso)
          this.practica.fechaInicio = new Date(this.practica.fechaInicio);

          this.calcularSemanas();

          this.evidenciaService.getByPracticaId(this.practica.idPractica).subscribe(data => {
            this.evidencias = data;
          });
        });

      } else {
        console.warn('⚠️ Usuario no tiene idPersona');
      }

    } catch (e) {
      console.error('❌ Error al parsear el usuario desde localStorage', e);
    }
  }

  calcularSemanas(): void {
    const inicio = new Date(this.practica.fechaInicio);
    const hoy = new Date();
    const semanasTranscurridas = Math.floor((hoy.getTime() - inicio.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    this.semanasDisponibles = Array.from({ length: semanasTranscurridas }, (_, i) => i + 1);
    this.semanaActual = semanasTranscurridas;
  }

  getEvidenciaPorSemana(semana: number): any {
    return this.evidencias.find(e => e.semana === semana);
  }

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0];
  }

  subirEvidencia(semana: number): void {
    if (!this.archivoSeleccionado) return;
    const formData = new FormData();
    formData.append('semana', semana.toString());
    formData.append('archivo', this.archivoSeleccionado);

    // ✅ Cambiado a idPractica
    this.evidenciaService.subirEvidencia(this.practica.idPractica, formData).subscribe(() => {
      alert('📎 Evidencia subida correctamente');
      window.location.reload();
    });
  }

  descargarGuia(): void {
    const token = localStorage.getItem('accessToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:4040/practica-ms/guia_subida_evidencias.pdf', {
      headers,
      responseType: 'blob'
    }).subscribe({
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
    window.open(`http://localhost:8080/practicaspp/evidencias/descargar/${nombreArchivo}`, '_blank');
  }
}