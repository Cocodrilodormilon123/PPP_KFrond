import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  username = '';
  mensaje = '';
  error = false;

  mostrarOld = false;
  mostrarNueva = false;
  mostrarConfirmar = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      this.username = datos.username || '';
    }
  }

  cambiarClave(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.error = true;
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.changePassword(this.username, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.error = false;
        this.mensaje = 'Contraseña actualizada correctamente. Redirigiendo...';
        this.oldPassword = this.newPassword = this.confirmPassword = '';

        setTimeout(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('usuario');
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.error = true;
        this.mensaje = 'No se pudo actualizar la contraseña. Verifique sus datos.';
      }
    });
  }
}
