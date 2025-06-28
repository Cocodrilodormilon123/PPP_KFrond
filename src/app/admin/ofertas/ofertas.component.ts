import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalOfertaComponent } from './modal-oferta/modal-oferta.component';
import { ModalCuposComponent } from './modal-cupos/modal-cupos.component';
import { ModalPostulantesComponent } from './modal-postulantes/modal-postulantes.component';
import { AdminOfertaService } from '../../services/admin-oferta.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];
  filtroEstado: string = 'TODAS';

  constructor(
    private ofertaService: AdminOfertaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();

    // Actualiza el contador en la vista cada segundo
    setInterval(() => {
      this.ofertas = [...this.ofertas];
    }, 1000);

    // Verifica cambios de estado automáticamente cada minuto
    setInterval(() => {
      this.filtrarOfertasPorEstado();
    }, 60000);
  }

  cargarOfertas(): void {
    this.ofertaService.getOfertas().subscribe({
      next: data => this.completarOfertas(data),
      error: err => console.error('Error cargando ofertas', err)
    });
  }

  filtrarOfertasPorEstado(): void {
    if (this.filtroEstado === 'TODAS') {
      this.cargarOfertas();
    } else {
      this.ofertaService.getOfertasPorEstado(this.filtroEstado).subscribe({
        next: data => this.completarOfertas(data),
        error: err => console.error('Error filtrando ofertas', err)
      });
    }
  }

  async completarOfertas(data: any[]): Promise<void> {
    const solicitudes = data.map(async oferta => {
      // reformat fecha si viene como dd/MM/yyyy
      if (oferta.fechaFin?.includes('/')) {
        const partes = oferta.fechaFin.split('/');
        if (partes.length === 3) {
          oferta.fechaFin = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
      }

      try {
        const vacantes = await this.ofertaService.getVacantesPorOferta(oferta.id).toPromise();
        oferta.vacantes = vacantes;
      } catch {
        oferta.vacantes = null;
      }

      return oferta;
    });

    this.ofertas = await Promise.all(solicitudes);
  }

  abrirModalOferta(oferta?: any): void {
    const dialogRef = this.dialog.open(ModalOfertaComponent, {
      width: '500px',
      data: oferta || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.filtrarOfertasPorEstado();
      }
    });
  }

  abrirModalCupos(idOferta: number): void {
    const ofertaSeleccionada = this.ofertas.find(o => o.id === idOferta);
    const cuposActuales = ofertaSeleccionada?.vacantes?.total || 0;

    const dialogRef = this.dialog.open(ModalCuposComponent, {
      width: '400px',
      data: { idOferta, cuposActuales }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.filtrarOfertasPorEstado();
      }
    });
  }

  abrirModalPostulantes(idOferta: number): void {
    this.dialog.open(ModalPostulantesComponent, {
      width: '800px',
      data: { ofertaId: idOferta }
    });
  }

  getTiempoRestante(fechaFin: string | Date, oferta?: any): string {
    const fin = typeof fechaFin === 'string' ? new Date(fechaFin).getTime() : fechaFin.getTime();
    const ahora = new Date().getTime();
    const diferencia = fin - ahora;

    if (diferencia <= 0) {
      if (oferta && oferta.estado === 'ACTIVA') {
        // Solo actualizar si aún está activa
        oferta.estado = 'FINALIZADA';
        this.ofertaService.actualizarEstadoOferta(oferta.id, 'FINALIZADA').subscribe({
          next: () => console.log(`Oferta ${oferta.id} finalizada automáticamente.`),
          error: err => console.error('Error al finalizar oferta automáticamente', err)
        });
      }
      return `<span style="color: red; font-weight: bold;">Finalizado</span>`;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }
}
