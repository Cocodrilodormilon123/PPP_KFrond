import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  buscar() {
    if (!this.codigo) return;

    // Paso 1: Obtener estudiante por código
    this.http.get<any>(`http://localhost:4040/persona-ms/personas/codigo/${this.codigo}`).subscribe({
      next: estudiante => {
        // 👇 Validación: solo tipoPersona === 'ESTUDIANTE'
        if (estudiante.tipoPersona !== 'ESTUDIANTE') {
          this.estudiante = null;
          this.practica = null;
          this.evidencias = [];
          alert('No está permitido buscar administradores en esta sección');
          return;
        }

        this.estudiante = estudiante;

        // Paso 2: Obtener práctica
        this.http.get<any>(`http://localhost:4040/practica-ms/practicas/persona/${estudiante.id}`).subscribe({
          next: practica => {
            //Validamos si no existe o no esta en estado EN_PROCESO de Practica
            if (!practica || practica.estado !== 'EN_PROCESO'){
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

  cargarEvidencias() {
    if (!this.practica?.id) return;
    this.http.get<any[]>(`http://localhost:4040/practica-ms/evidencias/practica/${this.practica.id}`).subscribe({
      next: evidencias => {
        this.evidencias = evidencias;
      },
      error: () => {
        this.evidencias = [];
      }
    });
  }

  handleArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0] || null;
  }

  subirEvidencia() {
    if (!this.archivoSeleccionado || !this.descripcion || !this.practica) {
      alert('Completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', this.descripcion);
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('idPractica', this.practica.id);

    this.http.post(`http://localhost:4040/practica-ms/evidencias`, formData).subscribe({
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

  // Fallback para imagen rota
  fotoError(event: any) {
    // Detener el ciclo eliminando el manejador después del primer error
    event.target.onerror = null;
    event.target.src = '';
  }

}
