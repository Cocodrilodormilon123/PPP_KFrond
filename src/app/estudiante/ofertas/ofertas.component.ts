import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];
  ofertasFiltradas: any[] = [];
  ofertaSeleccionada: any = null;  // 👈 Para mostrar detalle

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarOfertas();

    // Actualizar cada segundo para cuenta regresiva
    setInterval(() => {
      this.ofertas = [...this.ofertas];
    }, 1000);
  }

  cargarOfertas(): void {
    this.http.get<any[]>('http://localhost:4040/oferta-ms/ofertas')
      .subscribe({
        next: (data) => {
          const hoy = new Date();

          const promesas = data.map(oferta => {
            // Corregir formato de fecha si es necesario
            if (oferta.fechaFin && oferta.fechaFin.includes('/')) {
              const partes = oferta.fechaFin.split('/');
              if (partes.length === 3) {
                oferta.fechaFin = `${partes[2]}-${partes[1]}-${partes[0]}`; // yyyy-MM-dd
              }
            }

            // 👉 Consultar vacantes por oferta y agregar a cada objeto
            return this.http.get<any>(`http://localhost:4040/oferta-ms/vacantes/oferta/${oferta.id}`)
              .toPromise()
              .then(vacantes => {
                oferta.vacantes = vacantes;
                return oferta;
              })
              .catch(() => {
                oferta.vacantes = null;
                return oferta;
              });
          });

          Promise.all(promesas).then(ofertasConVacantes => {
            this.ofertas = ofertasConVacantes;

            this.ofertasFiltradas = this.ofertas.filter(oferta => {
              if (!oferta.fechaFin) return true;
              const fechaFin = new Date(oferta.fechaFin);
              return fechaFin.getTime() > hoy.getTime();
            });
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
