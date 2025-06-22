import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modal-cambiar-clave',
  templateUrl: './modal-cambiar-clave.component.html',
  styleUrls: ['./modal-cambiar-clave.component.css']
})
export class ModalCambiarClaveComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  mensaje = '';
  error = false;
  username: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalCambiarClaveComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    try {
      const raw = localStorage.getItem('usuario');
      console.log('[DEBUG] Valor en localStorage:', raw);

      if (!raw || raw === 'undefined' || raw === 'null') {
        console.warn('[WARN] No se encontró o es inválido "usuario" en localStorage.');
        this.dialogRef.close();  // 👈 Cierra el modal si no hay sesión válida
        return;
      }

      const datos = JSON.parse(raw);
      this.username = datos.username || '';

      if (!this.username) {
        console.warn('[WARN] "username" no encontrado en objeto localStorage.');
        this.dialogRef.close();  // 👈 También cierra si no hay username
      } else {
        console.log('[DEBUG] Username cargado:', this.username);
      }

    } catch (error) {
      console.error('[ERROR] Fallo al parsear localStorage:', error);
      this.dialogRef.close(); // 👈 Cierra modal en caso de error crítico
    }
  }

  cambiarClave(): void {
    this.error = false;
    this.mensaje = '';
    console.log('[DEBUG] Intentando cambiar clave de:', this.username);

    if (!this.username) {
      this.error = true;
      this.mensaje = 'Sesión inválida.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = true;
      this.mensaje = 'Las contraseñas nuevas no coinciden';
      return;
    }

    this.authService.changePassword(this.username, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.error = false;
        this.mensaje = 'Contraseña actualizada correctamente';
        console.log('[DEBUG] Contraseña cambiada exitosamente');
        setTimeout(() => this.dialogRef.close(true), 1000);
      },
      error: err => {
        this.error = true;
        this.mensaje = err.error?.message || 'Error al cambiar la contraseña';
        console.error('[ERROR] Fallo al cambiar contraseña:', err);
      }
    });
  }

  cerrar(): void {
    console.log('[DEBUG] Modal cerrado manualmente');
    this.dialogRef.close();
  }
}
