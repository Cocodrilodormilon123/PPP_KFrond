import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.css']
})
export class FormAdminComponent {
  admin = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    codigo: '',
    tipoPersona: 'ADMIN',
    estado: true
  };

  archivo!: File;

  constructor(private adminService: AdminService) {}

  handleArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.archivo = input.files[0];
    }
  }

  registrarAdmin(form: NgForm): void {
    if (!this.archivo) {
      alert('❗ Debes seleccionar una imagen.');
      return;
    }

    const fecha = new Date();
    const fechaRegistro = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

    const payload = {
      ...this.admin,
      fechaRegistro
    };

    this.adminService.registrarAdmin(payload, this.archivo).subscribe({
      next: () => {
        alert('✅ Administrador registrado correctamente');
        form.resetForm();
        this.archivo = undefined!;
      },
      error: (err) => {
        console.error('❌ Error al registrar administrador:', err);
        const mensajeError = err.error?.error || 'Error al registrar administrador.';
        alert('❌ ' + mensajeError);
      }
    });
  }
}
