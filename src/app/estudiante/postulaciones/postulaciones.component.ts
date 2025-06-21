import { Component, OnInit } from '@angular/core';
import { PostulacionService } from '../../services/postulacion.service';

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {
  postulaciones: any[] = [];
  idPersona: number = 0;

  constructor(private postulacionService: PostulacionService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      this.idPersona = user.idPersona; // Asegúrate que venga esto en el login
      this.cargarPostulaciones();
    }
  }

  cargarPostulaciones(): void {
    this.postulacionService.getPostulacionesByPersona(this.idPersona).subscribe({
      next: data => this.postulaciones = data,
      error: err => console.error('Error al cargar postulaciones', err)
    });
  }
}
