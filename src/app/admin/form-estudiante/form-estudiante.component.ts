import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  handleFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.foto = input.files[0];
    }
  }

  registrarEstudiante() {
    if (!this.foto) {
      alert('Debes seleccionar una imagen antes de registrar.');
      return;
    }

    const formData = new FormData();

    // ✅ Formato requerido por el backend: dd/MM/yyyy
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const fechaRegistro = `${dia}/${mes}/${anio}`; // ✅ Aquí el cambio correcto

    const personaPayload = {
      ...this.estudiante,
      fechaRegistro
    };

    formData.append('persona', new Blob(
      [JSON.stringify(personaPayload)],
      { type: 'application/json' })
    );

    formData.append('file', this.foto);

    this.http.post('http://localhost:4040/persona-ms/personas', formData).subscribe({
      next: () => alert('✅ Estudiante registrado correctamente'),
      error: err => {
        console.error('❌ Error al registrar estudiante:', err);
        alert('Error al registrar estudiante');
      }
    });
  }
}
