import { Component } from '@angular/core';
import { EstudianteDetalleService } from '../../services/estudiante-detalle.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  buscado: boolean = false;
  imagenEstudiante: SafeUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  constructor(
    private detalleService: EstudianteDetalleService,
    private sanitizer: DomSanitizer
  ) {}

  buscar(): void {
    if (!this.codigo) return;

    this.buscado = false;

    this.detalleService.buscarEstudiantePorCodigo(this.codigo).subscribe({
      next: estudiante => {
        if (estudiante.tipoPersona !== 'ESTUDIANTE') {
          this.resetVista();
          alert('No está permitido buscar administradores en esta sección');
          return;
        }

        this.estudiante = estudiante;
        this.buscado = true;

        if (estudiante.foto) {
          this.detalleService.verFoto(estudiante.foto).subscribe({
            next: (blob) => {
              const objectUrl = URL.createObjectURL(blob);
              this.imagenEstudiante = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
            },
            error: () => {
              this.imagenEstudiante = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }
          });
        }

        this.detalleService.obtenerPracticaPorPersona(estudiante.id).subscribe({
          next: practicas => {
            const activa = Array.isArray(practicas)
              ? practicas.find((p: any) => p.estado === 'EN_PROCESO')
              : (practicas.estado === 'EN_PROCESO' ? practicas : null);

            if (!activa) {
              this.resetPractica();
              return;
            }

            this.detalleService.obtenerDetallePractica(activa.id).subscribe({
              next: detalle => {
                this.practica = detalle;
                this.cargarEvidencias();
              },
              error: () => this.resetPractica()
            });
          },
          error: () => this.resetPractica()
        });
      },
      error: () => {
        this.resetVista();
        alert('Estudiante no encontrado');
      }
    });
  }

  cargarEvidencias(): void {
    if (!this.practica?.idPractica) return;

    this.detalleService.obtenerEvidencias(this.practica.idPractica).subscribe({
      next: evidencias => this.evidencias = evidencias,
      error: () => this.evidencias = []
    });
  }

  verEvidencia(nombreArchivo: string): void {
    this.detalleService.verArchivo(nombreArchivo).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }

  resetVista(): void {
    this.estudiante = null;
    this.practica = null;
    this.evidencias = [];
    this.buscado = true;
    this.imagenEstudiante = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  resetPractica(): void {
    this.practica = null;
    this.evidencias = [];
  }
}
