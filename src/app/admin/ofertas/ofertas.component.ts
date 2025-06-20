import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ModalOfertaComponent } from './modal-oferta/modal-oferta.component';
import { ModalCuposComponent } from './modal-cupos/modal-cupos.component';
import { ModalPostulantesComponent } from './modal-postulantes/modal-postulantes.component';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];
  filtroEstado: string = 'TODAS';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();

    setInterval(() => {
      this.ofertas = [...this.ofertas];
    }, 1000);
  }

  cargarOfertas() {
    this.http.get<any[]>('http://localhost:4040/oferta-ms/ofertas').subscribe({
      next: data => {
        this.completarOfertas(data);
      },
      error: err => console.error('Error cargando ofertas', err)
    });
  }

  filtrarOfertasPorEstado() {
    if (this.filtroEstado === 'TODAS') {
      this.cargarOfertas();
    } else {
      this.http.get<any[]>(`http://localhost:4040/oferta-ms/ofertas/estado/${this.filtroEstado}`).subscribe({
        next: data => {
          this.completarOfertas(data);
        },
        error: err => console.error('Error filtrando ofertas', err)
      });
    }
  }

  completarOfertas(data: any[]) {
    const promises = data.map(oferta => {
      const partes = oferta.fechaFin.split('/');
      if (partes.length === 3) {
        oferta.fechaFin = `${partes[2]}-${partes[1]}-${partes[0]}`;
      }

      return this.http.get<any>(`http://localhost:4040/oferta-ms/vacantes/oferta/${oferta.id}`).toPromise()
        .then(vacantes => {
          oferta.vacantes = vacantes;
          return oferta;
        })
        .catch(() => {
          oferta.vacantes = null;
          return oferta;
        });
    });

    Promise.all(promises).then(ofertasCompletas => {
      this.ofertas = ofertasCompletas;
    });
  }

  abrirModalOferta(oferta?: any) {
    const dialogRef = this.dialog.open(ModalOfertaComponent, {
      width: '500px',
      data: oferta || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.filtrarOfertasPorEstado(); // Refrescar según filtro actual
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
        this.filtrarOfertasPorEstado(); // Refrescar según filtro actual
      }
    });
  }

  abrirModalPostulantes(idOferta: number): void {
    this.dialog.open(ModalPostulantesComponent, {
      width: '800px',
      data: { ofertaId: idOferta }
    });
  }

  getTiempoRestante(fechaFin: string | Date): string {
    const ahora = new Date().getTime();
    const fin = new Date(fechaFin).getTime();
    const diferencia = fin - ahora;

    if (diferencia <= 0) return 'Finalizado';

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }
}
