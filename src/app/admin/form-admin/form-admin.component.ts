import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.css']
})
export class FormAdminComponent {
  admin = {
    codigo: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    tipoPersona: 'ADMIN',
    estado: true
  };

  archivoSeleccionado: File | null = null;

  constructor(private http: HttpClient) {}

  handleArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0] || null;
  }

  registrarAdmin() {
    if (!this.archivoSeleccionado) {
      alert('Debe seleccionar una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.archivoSeleccionado);
    formData.append('persona', new Blob([JSON.stringify({
      ...this.admin,
      fechaRegistro: new Date().toLocaleDateString('en-GB')
    })], { type: 'application/json' }));

    this.http.post('http://localhost:4040/persona-ms/personas', formData).subscribe({
      next: () => alert('Administrador registrado exitosamente'),
      error: err => console.error('Error al registrar administrador', err)
    });
  }
   resetFormulario() {
      this.admin = {
        codigo: '',
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        tipoPersona: 'ADMIN',
        estado: true
      };
      this.archivoSeleccionado = null;
    }
}
