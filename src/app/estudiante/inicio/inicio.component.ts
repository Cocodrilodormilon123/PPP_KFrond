import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InicioService } from '../../services/inicio.service';

@Component({
  selector: 'app-inicio-estudiante',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  postulacionesEnProceso = 0;
  ofertasActivas = 0;
  nombreUsuario = 'Nombre de Practicante';

  constructor(private inicioService: InicioService, private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      const idPersona = datos?.id || datos?.idPersona;
      this.nombreUsuario = datos?.nombre ? `¡Hola, ${datos.nombre}!` : this.nombreUsuario;

      if (idPersona) {
        this.inicioService.getPostulaciones(idPersona).subscribe(data => {
          this.postulacionesEnProceso = data.filter(p =>
            p.estado === 'PENDIENTE' || p.estado === 'EN_REVISION'
          ).length;
        });

        this.inicioService.getOfertas().subscribe(data => {
          this.ofertasActivas = data.filter(o => o.estado === 'ACTIVA').length;
        });
      }
    }
  }

  irAOfertas() {
    this.router.navigate(['estudiante/ofertas']);
  }

  irAdjuntarCV() {
    this.router.navigate(['estudiante/cv']);
  }
}
