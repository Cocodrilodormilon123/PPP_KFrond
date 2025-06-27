import { Component, OnInit } from '@angular/core';
import { AdminPostulacionService } from '../../services/admin-postulacion.service';

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {
  postulacionesAgrupadas: any[] = [];

  constructor(private postuService: AdminPostulacionService) {}

  ngOnInit(): void {
    this.cargarPostulacionesEnRevision();
  }

  cargarPostulacionesEnRevision(): void {
    this.postuService.getAllPostulaciones().subscribe((data: any[]) => {
      const enRevision = data.filter(p => p.estado === 'EN_REVISION');
      const agrupadas = new Map<number, any>();

      for (const p of enRevision) {
        const idOferta = p.oferta.id;
        if (!agrupadas.has(idOferta)) {
          agrupadas.set(idOferta, {
            idOferta,
            tituloOferta: p.oferta.titulo,
            nombreEmpresa: p.oferta.empresa?.nombre,
            expandido: false,
            postulantes: []
          });
        }

        const postulacion = {
          ...p,
          nombreEstudiante: 'Cargando...',
          documento: null
        };

        agrupadas.get(idOferta).postulantes.push(postulacion);

        this.postuService.getPersonaPorId(p.idPersona).subscribe({
          next: persona => {
            postulacion.nombreEstudiante = persona.nombre || 'Nombre no disponible';
          },
          error: () => {
            postulacion.nombreEstudiante = 'Desconocido';
          }
        });

        this.postuService.getDocumentoPorPostulacion(p.id).subscribe({
          next: doc => {
            postulacion.documento = doc;
          },
          error: err => {
            if (err.status !== 404) console.error('Error al obtener documento:', err);
          }
        });
      }

      this.postulacionesAgrupadas = Array.from(agrupadas.values());
    });
  }

  verDocumento(doc: any): void {
    if (!doc || !doc.rutaArchivo) {
      alert("No se encontró el documento para esta postulación.");
      return;
    }

    const nombre = doc.rutaArchivo.replace(/\\/g, '/').split('/').pop();
    if (!nombre) {
      alert("Nombre de archivo inválido.");
      return;
    }

    this.postuService.verDocumento(nombre).subscribe({
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

  aceptarPostulacion(postulacion: any): void {
    const confirmacion = confirm('¿Estás seguro de aceptar el documento? Esto generará una práctica.');
    if (!confirmacion) return;

    this.postuService.aceptarDocumento(postulacion.id).subscribe({
      next: () => {
        alert('✅ Documento aceptado y práctica generada correctamente.');
        this.cargarPostulacionesEnRevision();
      },
      error: (err) => {
        console.error('❌ Error al aceptar documento:', err);
        const msg = err?.error ?? 'No se pudo aceptar el documento.';
        alert(`Error del servidor: ${msg}`);
      }
    });
  }

  rechazarConComentario(postulacion: any): void {
    const comentario = prompt('❌ Ingrese el motivo de rechazo para el estudiante:');
    if (comentario !== null && comentario.trim() !== '') {
      this.postuService.rechazarDocumento(postulacion.id, comentario).subscribe({
        next: () => {
          alert('✅ Documento rechazado correctamente.');
          this.cargarPostulacionesEnRevision();
        },
        error: err => {
          console.error("❌ Error al rechazar documento:", err);
          const msg = err?.error ?? 'No se pudo rechazar el documento.';
          alert(`Error del servidor: ${msg}`);
        }
      });
    }
  }
}
