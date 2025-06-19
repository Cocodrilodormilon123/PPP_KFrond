import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];             // Todas las ofertas
  ofertasFiltradas: any[] = [];    // Solo las vigentes

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.http.get<any[]>('http://localhost:4040/oferta-ms/ofertas')
      .subscribe({
        next: (data) => {
          const hoy = new Date();
          this.ofertas = data.map(oferta => {
            // Conversión de fecha al formato ISO (si está como dd/MM/yyyy)
            if (oferta.fechaFin && oferta.fechaFin.includes('/')) {
              const partes = oferta.fechaFin.split('/');
              if (partes.length === 3) {
                oferta.fechaFin = `${partes[2]}-${partes[1]}-${partes[0]}`; // yyyy-MM-dd
              }
            }
            return oferta;
          });

          this.ofertasFiltradas = this.ofertas.filter(oferta => {
            if (!oferta.fechaFin) return true;
            const fechaFin = new Date(oferta.fechaFin);
            return fechaFin > hoy;
          });
        },
        error: (error) => {
          console.error('Error al cargar ofertas:', error);
        }
      });

  }

  verDetalle(oferta: any): void {
    alert(`Oferta: ${oferta.titulo}\nEmpresa: ${oferta.empresa?.nombre || 'Desconocida'}`);
  }
}
