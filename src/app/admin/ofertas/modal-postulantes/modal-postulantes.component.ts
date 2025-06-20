import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-postulantes',
  templateUrl: './modal-postulantes.component.html',
  styleUrls: ['./modal-postulantes.component.css']
})
export class ModalPostulantesComponent implements OnInit {
  postulaciones: any[] = [];
  ofertaId: number;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<ModalPostulantesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ofertaId = data.ofertaId;
  }

  ngOnInit(): void {
    this.cargarPostulantes();
  }

  cargarPostulantes() {
    this.http.get<any[]>(`http://localhost:4040/oferta-ms/postulaciones/oferta/${this.ofertaId}/postulantes-unicos-detallado`)
      .subscribe(resp => this.postulaciones = resp);
  }

  cambiarEstado(id: number, estado: string, comentario?: string) {
    let url = `http://localhost:4040/oferta-ms/postulaciones/${id}/estado?estado=${estado}`;

    if (comentario && comentario.trim() !== '') {
      url += `&comentario=${encodeURIComponent(comentario)}`;
    }

    this.http.put(url, {}).subscribe(() => {
      this.postulaciones = this.postulaciones.map(p => {
        if (p.id === id) {
          return { ...p, estado, comentario: comentario || '' };
        }
        return p;
      });
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
