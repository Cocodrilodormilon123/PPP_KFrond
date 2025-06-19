import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-cupos',
  templateUrl: './modal-cupos.component.html',
  styleUrls: ['./modal-cupos.component.css']
})
export class ModalCuposComponent {
  cupos: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idOferta: number, cuposActuales: number },
    public dialogRef: MatDialogRef<ModalCuposComponent>,
    private http: HttpClient
  ) {
    this.cupos = data.cuposActuales || 0;
  }

  guardar() {
    const urlBase = 'http://localhost:4040/oferta-ms/vacantes';
    this.http.post(`${urlBase}/oferta/${this.data.idOferta}/cupos?total=${this.cupos}`, {})
      .subscribe({
        next: res => {
          console.log('Vacante registrada o actualizada:', res);
          this.dialogRef.close(true);
        },
        error: err => {
          console.error('Error al guardar vacantes', err);
          alert('No se pudo guardar la vacante');
        }
      });
  }
}
