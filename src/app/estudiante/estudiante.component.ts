import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {
  estudianteNombre: string = 'Nombre del Estudiante';
  estudianteFoto: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  estudianteCodigo: string = '';
  sidebarVisible: boolean = true;

  constructor() { }

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.estudianteNombre = datos.nombre || this.estudianteNombre;
      this.estudianteCodigo = datos.codigo || '';

      // ✅ Corregido: construir la URL de la imagen si hay foto
      if (datos.foto) {
        this.estudianteFoto = `http://localhost:4040/persona-ms/img/${datos.foto}`;
      }
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
