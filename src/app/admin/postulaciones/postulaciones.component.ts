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
  urlBase = 'http://localhost:4040/oferta-ms/documento-postulacion/archivo/';

  constructor(private postuService: PostulacionService) {}

  ngOnInit(): void {
    this.cargarPostulaciones();
  }

  cargarPostulaciones(): void {
    this.postuService.getAllPostulaciones().subscribe(postus => {
      this.postulaciones = postus;
      postus.forEach(p => {
        this.postuService.getDocumentoByPostulacion(p.id).subscribe(doc => {
          this.documentos[p.id] = doc;
        });
      });
    });
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    this.postuService.actualizarEstado(id, nuevoEstado).subscribe(() => this.cargarPostulaciones());
  }

  cambiarEstadoDocumento(id: number, nuevoEstado: string): void {
    this.postuService.actualizarEstadoDocumento(id, nuevoEstado).subscribe({
      next: () => {
        alert(`Documento marcado como ${nuevoEstado}`);
        this.cargarPostulaciones(); // recargar para reflejar cambio
      },
      error: err => {
        console.error('Error al actualizar documento', err);
        alert('Error al actualizar el estado del documento.');
      }
    });
  }

  extraerNombre(ruta: string): string {
    return ruta.replace(/^.*[\\/]/, '');
  }

  verDocumento(rutaArchivo: string): void {
    const nombreArchivo = rutaArchivo.split('/').pop();
    this.postuService.verDocumento(nombreArchivo!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

}
