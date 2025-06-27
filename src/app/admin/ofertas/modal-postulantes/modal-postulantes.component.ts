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

  cuposOcupados: number = 0;
  cuposTotales: number = 0;
  limiteAlcanzado: boolean = false;

  constructor(
    private postulacionService: AdminPostulacionService,
    private dialogRef: MatDialogRef<ModalPostulantesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ofertaId = data.ofertaId;
  }

  ngOnInit(): void {
    this.cargarPostulantes();
    this.cargarCupos();
  }

  cargarPostulantes(): void {
    this.postulacionService.obtenerPostulantesUnicosDetallado(this.ofertaId).subscribe({
      next: (resp) => this.postulaciones = resp,
      error: () => this.postulaciones = []
    });
  }

  cargarCupos(): void {
    this.postulacionService.obtenerVacantesPorOferta(this.ofertaId).subscribe({
      next: (resp) => {
        this.cuposOcupados = resp.ocupados;
        this.cuposTotales = resp.total;
        this.limiteAlcanzado = this.cuposOcupados >= this.cuposTotales;
      },
      error: () => {
        this.cuposOcupados = 0;
        this.cuposTotales = 0;
        this.limiteAlcanzado = false;
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string, comentario?: string): void {
    const postulacion = this.postulaciones.find(p => p.id === id);
    const estadoAnterior = (postulacion?.estado || '').toUpperCase();

    if (nuevoEstado === 'EN_REVISION' && this.limiteAlcanzado && estadoAnterior !== 'EN_REVISION') {
      alert('Ya no hay más cupos disponibles.');
      return;
    }

    this.postulacionService.actualizarEstado(id, nuevoEstado, comentario).subscribe(() => {
      // Actualiza visualmente
      this.postulaciones = this.postulaciones.map(p => {
        if (p.id === id) {
          return { ...p, estado: nuevoEstado, comentario: comentario || '' };
        }
        return p;
      });

      // ✅ Manejo de cupos según cambio de estado
      if (estadoAnterior !== 'EN_REVISION' && nuevoEstado === 'EN_REVISION') {
          this.postulacionService.incrementarCupo(this.ofertaId).subscribe(() => this.cargarCupos());
      }

      if (estadoAnterior === 'EN_REVISION' && nuevoEstado === 'RECHAZADA') {
        this.postulacionService.reducirCupo(this.ofertaId).subscribe(() => this.cargarCupos());
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
