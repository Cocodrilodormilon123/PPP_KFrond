import { Component } from '@angular/core';
import { EstudianteDetalleService } from '../../services/estudiante-detalle.service';

@Component({
  selector: 'app-estudiante-detalle',
  templateUrl: './estudiante-detalle.component.html',
  styleUrls: ['./estudiante-detalle.component.css']
})
export class EstudianteDetalleComponent {
  codigo: string = '';
  estudiante: any = null;
  practica: any = null;
  evidencias: any[] = [];

  constructor(private detalleService: EstudianteDetalleService) {}

  buscar(): void {
    if (!this.codigo) return;

    this.detalleService.buscarEstudiantePorCodigo(this.codigo).subscribe({
      next: estudiante => {
        if (estudiante.tipoPersona !== 'ESTUDIANTE') {
          this.estudiante = null;
          this.practica = null;
          this.evidencias = [];
          alert('No está permitido buscar administradores en esta sección');
          return;
        }

        this.estudiante = estudiante;

        this.detalleService.obtenerPracticaPorPersona(estudiante.id).subscribe({
          next: practicas => {
            const activa = Array.isArray(practicas)
              ? practicas.find((p: any) => p.estado === 'EN_PROCESO')
              : (practicas.estado === 'EN_PROCESO' ? practicas : null);

            if (!activa) {
              this.practica = null;
              this.evidencias = [];
              return;
            }

            this.practica = activa;
            this.cargarEvidencias();
          },
          error: () => {
            this.practica = null;
            this.evidencias = [];
          }
        });
      },
      error: () => {
        this.estudiante = null;
        this.practica = null;
        this.evidencias = [];
        alert('Estudiante no encontrado');
      }
    });
  }

  cargarEvidencias(): void {
    if (!this.practica?.id) return;

    this.detalleService.obtenerEvidencias(this.practica.id).subscribe({
      next: evidencias => {
        this.evidencias = evidencias;
      },
      error: () => {
        this.evidencias = [];
      }
    });
  }

  fotoError(event: any): void {
    event.target.onerror = null;
    event.target.src = '';
  }
}
