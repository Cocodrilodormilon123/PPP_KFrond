import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminOfertaService } from '../../../services/admin-oferta.service'; // ← Ruta corregida

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
    private adminOfertaService: AdminOfertaService
  ) {
    this.cupos = data.cuposActuales || 0;
  }

  guardar(): void {
    this.adminOfertaService.asignarCupos(this.data.idOferta, this.cupos)
      .subscribe({
        next: (res: any) => {
          console.log('✅ Vacante registrada o actualizada:', res);
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error('❌ Error al guardar vacantes:', err);
          alert('No se pudo guardar la vacante');
        }
      });
  }

  preventMinus(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
}
