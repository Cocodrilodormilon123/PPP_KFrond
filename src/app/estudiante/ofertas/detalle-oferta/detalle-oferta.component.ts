import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detalle-oferta',
  templateUrl: './detalle-oferta.component.html',
  styleUrls: ['./detalle-oferta.component.css']
})
export class DetalleOfertaComponent {
  @Input() oferta: any = null;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  postular(): void {
    //para saber el id de la persona postulante
    const stored = localStorage.getItem('user');
    const idPersona = stored ? JSON.parse(stored).idPersona : null;
    // Convertir la fecha al formato que espera el backend: "dd/MM/yyyy"
    const fecha = this.convertirFecha(new Date());

    const nuevaPostulacion = {
      idPersona: idPersona, // ⚠️ temporal — cambiar luego por el ID real desde el token
      comentario: 'En espera',
      estado: 'PENDIENTE',
      fechaPostulacion: fecha, // formato "dd/MM/yyyy"
      oferta: {
        id: this.oferta.id
      }
    };

    console.log('JSON a enviar:', nuevaPostulacion); // 👈 para debug
    this.http.post('http://localhost:4040/oferta-ms/postulaciones', nuevaPostulacion)
      .subscribe({
        next: () => {
          alert('Postulación registrada con éxito');
          this.cerrarPanel();
        },
        error: (err) => {
          console.error('Error al postular:', err);
          alert('Ocurrió un error al postular');
        }
      });
  }

  cerrarPanel(): void {
    this.cerrar.emit();
  }

  // 🛠️ Función para convertir a formato "dd/MM/yyyy"
  private convertirFecha(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
}
