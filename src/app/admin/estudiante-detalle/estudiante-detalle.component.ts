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

  mostrarFormulario: boolean = false;
  descripcion: string = '';
  archivoSeleccionado: File | null = null;

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
          next: practica => {
            if (!practica || practica.estado !== 'EN_PROCESO') {
              this.practica = null;
              this.evidencias = [];
              return;
            }

            this.practica = practica;
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

  handleArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0] || null;
  }

  subirEvidencia(): void {
    if (!this.archivoSeleccionado || !this.descripcion || !this.practica) {
      alert('Completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', this.descripcion);
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('idPractica', this.practica.id);

    this.detalleService.subirEvidencia(formData).subscribe({
      next: () => {
        alert('Evidencia subida correctamente');
        this.descripcion = '';
        this.archivoSeleccionado = null;
        this.mostrarFormulario = false;
        this.cargarEvidencias();
      },
      error: () => alert('Error al subir evidencia')
    });
  }

  fotoError(event: any): void {
    event.target.onerror = null;
    event.target.src = '';
  }
}
