import { Component, OnInit } from '@angular/core';
import { PostulacionService } from '../../services/postulacion.service';

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {
  postulaciones: any[] = [];
  documentos: { [idPostulacion: number]: any } = {};
  idPersona: number = 0;

  constructor(private postulacionService: PostulacionService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      const user = JSON.parse(stored);
      if (user && user.idPersona) {
        this.idPersona = user.idPersona;
        console.log('ID persona recuperado:', this.idPersona);
        this.cargarPostulaciones();
      } else {
        console.error('idPersona no encontrado en el objeto usuario');
      }
    } else {
      console.error("No se encontró 'usuario' en localStorage");
    }
  }

  cargarPostulaciones(): void {
    this.postulacionService.getPostulacionesByPersona(this.idPersona).subscribe({
      next: data => {
        this.postulaciones = data.map(p => ({
          ...p,
          fechaPostulacion: this.convertirFecha(p.fechaPostulacion)
        }));

        // 🔁 Cargar documentos asociados a cada postulación
        this.postulaciones.forEach(p => {
          this.postulacionService.getDocumentoByPostulacion(p.id).subscribe(doc => {
            this.documentos[p.id] = doc;
          });
        });
      },
      error: err => console.error('Error al cargar postulaciones', err)
    });
  }

  convertirFecha(fechaStr: string): Date {
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      return new Date(`${anio}-${mes}-${dia}`);
    } else if (fechaStr.includes('-')) {
      return new Date(fechaStr);
    }
    return new Date(fechaStr);
  }

  // ✅ Descargar formato oficial
  descargarPlantilla(idPostulacion: number): void {
    this.postulacionService.descargarPlantilla(idPostulacion).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `formato_postulacion_${idPostulacion}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Error al descargar plantilla', err);
        alert('No se pudo descargar la plantilla');
      }
    });
  }

  subirArchivo(event: any, idPostulacion: number): void {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const url = `http://localhost:4040/oferta-ms/documento-postulacion/${idPostulacion}/archivo`;
    this.postulacionService.subirArchivo(url, formData).subscribe({
      next: () => {
        alert("Archivo subido correctamente.");
        this.cargarPostulaciones();
      },
      error: err => {
        console.error('Error al subir archivo', err);
        alert("Error al subir archivo. Verifica el formato.");
      }
    });
  }

}
