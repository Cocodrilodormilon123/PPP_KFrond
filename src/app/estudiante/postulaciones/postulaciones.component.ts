import { Component, OnInit } from '@angular/core';
import { PostulacionService } from '../../services/postulacion.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {
  postulaciones: any[] = [];
  documentos: { [idPostulacion: number]: any } = {};
  archivosCargados: { [idPostulacion: number]: File } = {};
  idPersona: number = 0;
  expandedRows: { [id: number]: boolean } = {};
  urlPDF: string | null = null;

  constructor(
    private postulacionService: PostulacionService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      const user = JSON.parse(stored);
      if (user && user.idPersona) {
        this.idPersona = user.idPersona;
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
          idOferta: p.oferta?.id ?? null,
          tituloOferta: p.oferta?.titulo ?? 'Sin título',
          nombreEmpresa: p.oferta?.empresa?.nombre ?? 'No especificado',
          fechaPostulacion: this.convertirFecha(p.fechaPostulacion)
        }));

        this.postulaciones.forEach(p => {
          this.postulacionService.getDocumentoByPostulacion(p.id).subscribe({
            next: doc => this.documentos[p.id] = doc,
            error: err => {
              if (err.status !== 404) console.error('Error al obtener documento', err);
            }
          });
        });
      },
      error: err => console.error('❌ Error al cargar postulaciones', err)
    });
  }

  convertirFecha(fechaStr: string): Date {
    if (fechaStr.includes('/')) {
      const [dia, mes, anio] = fechaStr.split('/');
      return new Date(`${anio}-${mes}-${dia}`);
    }
    return new Date(fechaStr);
  }

  descargarPlantilla(idPostulacion: number): void {
    this.postulacionService.descargarPlantilla(idPostulacion).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `formato_postulacion_${idPostulacion}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Error al descargar plantilla', err);
        alert('No se pudo descargar la plantilla');
      }
    });
  }

  adjuntarArchivo(event: any, idPostulacion: number): void {
    const file = event.target.files[0];
    if (file) {
      this.archivosCargados[idPostulacion] = file;
    }
  }

  verArchivoTemporal(idPostulacion: number): void {
    const file = this.archivosCargados[idPostulacion];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } else {
      alert('No hay archivo seleccionado para vista previa');
    }
  }

  subirArchivo(idPostulacion: number): void {
    const file = this.archivosCargados[idPostulacion];
    if (!file) {
      alert('Adjunta un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = `http://localhost:4040/oferta-ms/documento-postulacion/${idPostulacion}/archivo`;
    this.postulacionService.subirArchivo(url, formData).subscribe({
      next: () => {
        alert("✅ Archivo subido correctamente.");
        this.cargarPostulaciones();
      },
      error: err => {
        if (err.status === 413) {
          alert('❌ El archivo es demasiado grande. Límite: 20MB.');
        } else if (err.status === 400) {
          alert('❌ Formato de archivo no permitido.');
        } else {
          alert("❌ Error al subir archivo.");
        }
        console.error('Error al subir archivo', err);
      }
    });
  }

  verDocumentoSubido(idPostulacion: number): void {
    const doc = this.documentos[idPostulacion];
    if (!doc?.rutaArchivo) {
      alert("No se encontró el documento subido.");
      return;
    }

    const nombre = doc.rutaArchivo.replace(/\\/g, '/').split('/').pop();
    if (!nombre) return;

    this.postulacionService.verDocumento(nombre).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url);
      },
      error: err => {
        alert("No se pudo visualizar el archivo.");
        console.error("Error al ver documento:", err);
      }
    });
  }

  sanitizarURL(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  extraerNombre(ruta: string): string {
    return ruta.split(/[\\/]/).pop() || 'archivo.pdf';
  }

  toggleDetalle(id: number): void {
    this.expandedRows[id] = !this.expandedRows[id];
  }
}
