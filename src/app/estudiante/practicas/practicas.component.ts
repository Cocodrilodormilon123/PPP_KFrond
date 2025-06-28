import { Component, OnInit } from '@angular/core';
import { PracticaService } from '../../services/practica.service';
import { EvidenciaService } from '../../services/evidencia.service';

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
    private evidenciaService: EvidenciaService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('usuario');
    if (!userStr) return;

    try {
      const usuario = JSON.parse(userStr);
      if (usuario?.idPersona) {
        this.idPersona = usuario.idPersona;

        this.practicaService.getDetallePorIdPersona(this.idPersona).subscribe(detalle => {
          this.practica = detalle;
          this.practica.fechaInicio = new Date(this.practica.fechaInicio);

          this.evidenciaService.getByPracticaId(this.practica.idPractica).subscribe(data => {
            this.evidencias = this.parsearFechasEvidencias(data);
            this.calcularSemanas();
          });
        });
      }
    } catch (e) {
      console.error('Error al parsear usuario', e);
    }
  }

  calcularSemanas(): void {
    const inicio = new Date(this.practica.fechaInicio);
    const hoy = new Date();
    const semanasTranscurridas = Math.floor((hoy.getTime() - inicio.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    this.semanaActual = semanasTranscurridas;

    const semanasConEvidencia = this.evidencias.map(e => e.semana);
    const siguienteSemana = Math.max(...semanasConEvidencia, 0) + 1;

    this.semanasDisponibles = [...semanasConEvidencia];
    if (!this.semanasDisponibles.includes(siguienteSemana)) {
      this.semanasDisponibles.push(siguienteSemana);
    }
    this.semanasDisponibles.sort((a, b) => a - b);
  }

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0];
  }

  subirEvidencia(semana: number): void {
    if (!this.archivoSeleccionado) return;
    const formData = new FormData();
    formData.append('semana', semana.toString());
    formData.append('archivo', this.archivoSeleccionado);

    this.evidenciaService.subirEvidencia(this.practica.idPractica, formData).subscribe(() => {
      alert('📎 Evidencia subida correctamente');
      this.evidenciaService.getByPracticaId(this.practica.idPractica).subscribe(data => {
        this.evidencias = this.parsearFechasEvidencias(data);
        this.archivoSeleccionado = null;

        if (!this.semanasDisponibles.includes(semana + 1)) {
          this.semanasDisponibles.push(semana + 1);
          this.semanasDisponibles.sort((a, b) => a - b);
        }
      });
    });
  }

  descargarGuia(): void {
    this.evidenciaService.descargarGuiaPDF();
  }

  descargarEvidencia(nombreArchivo: string): void {
    this.evidenciaService.descargarEvidencia(nombreArchivo);
  }

  getEvidenciaPorSemana(semana: number): any {
    return this.evidencias.find(e => e.semana === semana);
  }

  private parsearFechasEvidencias(data: any[]): any[] {
    return data.map(e => ({
      ...e,
      fechaSubida: this.parseFechaDDMMYYYY(e.fechaSubida)
    }));
  }

  private parseFechaDDMMYYYY(fechaStr: string): Date {
    if (!fechaStr || typeof fechaStr !== 'string') return new Date(NaN);
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return new Date(NaN);
    const [dia, mes, anio] = partes;
    return new Date(+anio, +mes - 1, +dia);
  }

  esFechaValida(fecha: any): boolean {
    return fecha instanceof Date && !isNaN(fecha.getTime());
  }

  puedeSubirSemana(semana: number): boolean {
    const inicio = new Date(this.practica.fechaInicio);
    const hoy = new Date();
    const diasDesdeInicio = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return diasDesdeInicio >= (semana - 1) * 7;
  }
}
