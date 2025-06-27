import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PostulacionService } from '../../../services/postulacion.service'; // Usa ruta relativa

@Component({
  selector: 'app-detalle-oferta',
  templateUrl: './detalle-oferta.component.html',
  styleUrls: ['./detalle-oferta.component.css']
})
export class DetalleOfertaComponent {
  @Input() oferta: any = null;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private postulacionService: PostulacionService) {}

  postular(): void {
    const stored = localStorage.getItem('usuario');
    const idPersona = stored ? JSON.parse(stored).idPersona : null;

    if (!idPersona) {
      alert('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    const fecha = this.convertirFecha(new Date());

    const nuevaPostulacion = {
      idPersona: idPersona,
      comentario: 'En espera',
      estado: 'PENDIENTE',
      fechaPostulacion: fecha,
      oferta: {
        id: this.oferta.id
      }
    };

    console.log('JSON a enviar:', nuevaPostulacion);

    this.postulacionService.postular(nuevaPostulacion).subscribe({
      next: () => {
        alert('Postulación registrada con éxito');
        this.cerrarPanel();
      },
      error: (err: any) => {
        console.error('Error al postular:', err);
        alert('Ocurrió un error al postular');
      }
    });
  }

  cerrarPanel(): void {
    this.cerrar.emit();
  }

  private convertirFecha(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
}
