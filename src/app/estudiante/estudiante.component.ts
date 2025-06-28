import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InicioService } from '../services/inicio.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {
  estudianteNombre = 'Nombre del Estudiante';
  estudianteCodigo = '';
  estudianteFoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  sidebarVisible = true;

  constructor(
    private router: Router,
    private inicioService: InicioService
  ) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.estudianteNombre = datos.nombre || this.estudianteNombre;
      this.estudianteCodigo = datos.codigo || '';

      if (datos.foto) {
        this.estudianteFoto = this.inicioService.getFotoUrl(datos.foto);
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  cerrarSesion(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('estadosPostulacion');
    this.router.navigate(['/login']);
  }

  irAPostulaciones(): void {
    this.router.navigate(['estudiante/postulaciones']);
  }
}
