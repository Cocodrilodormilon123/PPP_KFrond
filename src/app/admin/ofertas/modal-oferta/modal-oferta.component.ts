import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-oferta',
  templateUrl: './modal-oferta.component.html'
})
export class ModalOfertaComponent implements OnInit {

  nuevaOferta: any = {
    titulo: '',
    descripcion: '',
    ubicacion: '',            // NUEVO
    requerimientos: '',       // NUEVO
    modalidad: 'PRESENCIAL',
    estado: 'ACTIVA',
    fechaFin: '',
    empresaId: null
  };

  empresas: any[] = [];

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<ModalOfertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:4040/oferta-ms/empresas/estado/ACTIVA')
      .subscribe({
        next: res => this.empresas = res,
        error: err => console.error('Error al cargar empresas', err)
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

  guardar() {
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
      empresa: {
        id: this.nuevaOferta.empresaId
      }
    };

    let request$;

    if (this.data) {
      request$ = this.http.put(
        `http://localhost:4040/oferta-ms/ofertas/${this.data.id}`,
        ofertaAEnviar
      );
    } else {
      request$ = this.http.post(
        `http://localhost:4040/oferta-ms/ofertas`,
        ofertaAEnviar
      );
    }

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
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

  cerrar() {
    this.dialogRef.close(false);
  }
}
