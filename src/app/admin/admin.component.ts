import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminNombre: string = 'Administrador';
  adminCodigo: string = '';
  adminFoto: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  sidebarVisible: boolean = true;

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.adminNombre = datos.nombre || this.adminNombre;
      this.adminCodigo = datos.codigo || '';

      // ✅ URL personalizada para imagen del admin (igual que estudiante)
      if (datos.foto) {
        this.adminFoto = `http://localhost:4040/persona-ms/img/${datos.foto}`;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
