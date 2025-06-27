import { Component, OnInit } from '@angular/core';
import { OfertaService } from '../../services/oferta.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];
  ofertasFiltradas: any[] = [];
  ofertaSeleccionada: any = null;

  constructor(private ofertaService: OfertaService) {}

  ngOnInit(): void {
    this.cargarOfertas();

    setInterval(() => {
      this.ofertas = [...this.ofertas]; // Forzar cambio en la vista (cuenta regresiva)
    }, 1000);
  }

  cargarOfertas(): void {
    this.ofertaService.getOfertas().subscribe({
      next: async (data) => {
        const hoy = new Date();

        const promesas = data.map(async oferta => {
          // Corrección de fecha
          if (oferta.fechaFin && oferta.fechaFin.includes('/')) {
            const partes = oferta.fechaFin.split('/');
            if (partes.length === 3) {
              oferta.fechaFin = `${partes[2]}-${partes[1]}-${partes[0]}`;
            }
          }

          try {
            const vacantes = await this.ofertaService.getVacantesPorOferta(oferta.id);
            oferta.vacantes = vacantes;
          } catch {
            oferta.vacantes = null;
          }

          return oferta;
        });

        const ofertasConVacantes = await Promise.all(promesas);
        this.ofertas = ofertasConVacantes;
        this.ofertasFiltradas = this.ofertas.filter(oferta => {
          if (!oferta.fechaFin) return true;
          return new Date(oferta.fechaFin).getTime() > hoy.getTime();
        });
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
      }
    });
  }

  verDetalle(oferta: any): void {
    this.ofertaSeleccionada = oferta;
  }

  cerrarDetalle(): void {
    this.ofertaSeleccionada = null;
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
