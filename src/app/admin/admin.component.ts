import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalCambiarClaveComponent } from './modal-cambiar-clave/modal-cambiar-clave.component';

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
  mostrarMenu: boolean = false;

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.adminNombre = datos.nombre || this.adminNombre;
      this.adminCodigo = datos.codigo || '';
      if (datos.foto) {
        this.adminFoto = `http://localhost:4040/persona-ms/img/${datos.foto}`;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  cambiarClave(): void {
    this.dialog.open(ModalCambiarClaveComponent, {
      width: '400px'
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  onMouseOut(event: MouseEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const dropdown = document.querySelector('.user-dropdown-wrapper');
    if (dropdown && !dropdown.contains(relatedTarget)) {
      this.mostrarMenu = false;
    }
  }
}
