import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.estudianteNombre = datos.nombre || this.estudianteNombre;
      this.estudianteCodigo = datos.codigo || '';
      if (datos.foto) {
        this.estudianteFoto = `http://localhost:4040/persona-ms/img/${datos.foto}`;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  cerrarSesion(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
