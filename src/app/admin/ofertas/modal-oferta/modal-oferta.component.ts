import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminOfertaService } from '../../../services/admin-oferta.service'; // ← Ruta corregida

@Component({
  selector: 'app-modal-oferta',
  templateUrl: './modal-oferta.component.html',
  styleUrls: ['./modal-oferta.component.css']
})
export class ModalOfertaComponent implements OnInit {

  nuevaOferta: any = {
    titulo: '',
    descripcion: '',
    ubicacion: '',
    requerimientos: '',
    modalidad: 'PRESENCIAL',
    estado: 'ACTIVA',
    fechaFin: '',
    empresaId: null
  };

  empresas: any[] = [];

  constructor(
    private ofertaService: AdminOfertaService,
    private dialogRef: MatDialogRef<ModalOfertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.ofertaService.obtenerEmpresasActivas().subscribe({
      next: (res: any) => this.empresas = res,
      error: (err: any) => console.error('Error al cargar empresas', err)
    });

    if (this.data) {
      this.nuevaOferta = {
        titulo: this.data.titulo,
        descripcion: this.data.descripcion,
        ubicacion: this.data.ubicacion || '',
        requerimientos: this.data.requerimientos || '',
        modalidad: this.data.modalidad,
        estado: this.data.estado,
        fechaFin: this.data.fechaFin,
        empresaId: this.data.empresa?.id
      };
    }
  }

  guardar(): void {
    if (!this.nuevaOferta.empresaId) {
      alert('Debes seleccionar una empresa');
      return;
    }

    const ofertaAEnviar = {
      titulo: this.nuevaOferta.titulo,
      descripcion: this.nuevaOferta.descripcion,
      ubicacion: this.nuevaOferta.ubicacion,
      requerimientos: this.nuevaOferta.requerimientos,
      modalidad: this.nuevaOferta.modalidad,
      estado: this.nuevaOferta.estado,
      fechaFin: this.convertirFechaDDMMYYYY(this.nuevaOferta.fechaFin),
      empresa: { id: this.nuevaOferta.empresaId }
    };

    const request$ = this.data
      ? this.ofertaService.actualizarOferta(this.data.id, ofertaAEnviar)
      : this.ofertaService.crearOferta(ofertaAEnviar);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        console.error('Error al guardar la oferta', err);
        alert('Error al guardar la oferta');
      }
    });
  }

  convertirFechaDDMMYYYY(fecha: string | Date): string {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
