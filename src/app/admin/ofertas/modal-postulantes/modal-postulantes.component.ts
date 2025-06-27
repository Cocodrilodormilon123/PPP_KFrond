import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminPostulacionService } from '../../../services/admin-postulacion.service';

@Component({
  selector: 'app-modal-postulantes',
  templateUrl: './modal-postulantes.component.html',
  styleUrls: ['./modal-postulantes.component.css']
})
export class ModalPostulantesComponent implements OnInit {
  postulaciones: any[] = [];
  ofertaId: number;

  constructor(
    private postulacionService: AdminPostulacionService,
    private dialogRef: MatDialogRef<ModalPostulantesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ofertaId = data.ofertaId;
  }

  ngOnInit(): void {
    this.cargarPostulantes();
  }

  cargarPostulantes(): void {
    this.postulacionService.obtenerPostulantesUnicosDetallado(this.ofertaId).subscribe({
      next: (resp) => this.postulaciones = resp,
      error: () => this.postulaciones = []
    });
  }

  cambiarEstado(id: number, estado: string, comentario?: string): void {
    this.postulacionService.actualizarEstado(id, estado, comentario).subscribe(() => {
      this.postulaciones = this.postulaciones.map(p => {
        if (p.id === id) {
          return { ...p, estado, comentario: comentario || '' };
        }
        return p;
      });
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
