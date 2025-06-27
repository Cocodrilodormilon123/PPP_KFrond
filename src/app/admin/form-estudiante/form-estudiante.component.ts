import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EstudianteService } from '../../services/estudiante.service';

@Component({
  selector: 'app-form-estudiante',
  templateUrl: './form-estudiante.component.html',
  styleUrls: ['./form-estudiante.component.css']
})
export class FormEstudianteComponent {
  estudiante = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    codigo: '',
    ep: 'Ingeniería de Sistemas',
    tipoPersona: 'ESTUDIANTE',
    estado: true
  };

  foto!: File;

  constructor(private estudianteService: EstudianteService) {}

  handleFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.foto = input.files[0];
    }
  }

  registrarEstudiante(form: NgForm): void {
    if (!this.foto) {
      alert('❗ Debes seleccionar una imagen antes de registrar.');
      return;
    }

    const fecha = new Date();
    const fechaRegistro = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

    const personaPayload = {
      ...this.estudiante,
      fechaRegistro
    };

    this.estudianteService.registrarEstudiante(personaPayload, this.foto).subscribe({
      next: () => {
        alert('✅ Estudiante y usuario registrados correctamente');
        form.resetForm();
        this.foto = undefined!;
      },
      error: (err) => {
        console.error('❌ Error al registrar estudiante:', err);
        const mensajeError = err.error?.error || 'Error al registrar estudiante.';
        alert('❌ ' + mensajeError);
      }
    });
  }
}
