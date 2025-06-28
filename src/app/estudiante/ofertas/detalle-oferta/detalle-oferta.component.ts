import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PostulacionService } from '../../../services/postulacion.service';

@Component({
  selector: 'app-detalle-oferta',
  templateUrl: './detalle-oferta.component.html',
  styleUrls: ['./detalle-oferta.component.css']
})
export class DetalleOfertaComponent {
  private _oferta: any = null;

  @Input() set oferta(value: any) {
    this._oferta = value;
    if (value) this.prepararPostulacion();
  }
  get oferta(): any {
    return this._oferta;
  }

  @Output() cerrar = new EventEmitter<void>();

  tienePracticaActiva: boolean = false;
  idPersona: number | null = null;

  constructor(private postulacionService: PostulacionService) {}

  prepararPostulacion(): void {
    const stored = localStorage.getItem('usuario');
    this.idPersona = stored ? JSON.parse(stored).idPersona : null;

    console.log('ID Persona:', this.idPersona);

    if (this.idPersona) {
      this.postulacionService.verificarPracticaActiva(this.idPersona).subscribe({
        next: (res) => {
          this.tienePracticaActiva = res;
          console.log('¿Tiene práctica activa?', res);
        },
        error: (err) => {
          console.error('Error al verificar práctica activa:', err);
          this.tienePracticaActiva = false;
        }
      });
    }
  }

  postular(): void {
    if (this.oferta.vacantes?.disponibles === 0) {
      alert('Esta oferta no tiene vacantes disponibles.');
      return;
    }

    if (this.tienePracticaActiva) {
      alert('Ya tienes una práctica en proceso. No puedes postular a otra oferta.');
      return;
    }

    if (!this.idPersona) {
      alert('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    const nuevaPostulacion = {
      idPersona: this.idPersona,
      comentario: 'En espera',
      estado: 'PENDIENTE',
      fechaPostulacion: this.convertirFecha(new Date()),
      oferta: { id: this.oferta.id }
    };

    console.log('Postulación enviada:', nuevaPostulacion);

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
