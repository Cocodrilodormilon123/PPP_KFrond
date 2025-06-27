import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  adminNombre = 'Administrador';
  adminCodigo = '';
  adminFoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  sidebarVisible = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.adminNombre = datos.nombre || this.adminNombre;
      this.adminCodigo = datos.codigo || '';
      if (datos.foto) {
        this.adminFoto = `/persona-ms/img/${datos.foto}`;
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
