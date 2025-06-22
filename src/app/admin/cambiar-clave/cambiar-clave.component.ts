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
      this.mensaje = 'Las nuevas contraseñas no coinciden';
      this.error = true;
      return;
    }

    this.authService.changePassword(this.username, this.oldPassword, this.newPassword)
      .subscribe({
        next: (res) => {
          console.log('Respuesta del backend:', res);

          // Limpiar campos
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';

          // Mostrar mensaje y redirigir
          this.mensaje = 'Contraseña cambiada correctamente. Redirigiendo...';
          this.error = false;

          setTimeout(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('usuario');
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
          if (err.status === 401) {
            this.mensaje = 'La contraseña actual es incorrecta';
          } else {
            this.mensaje = 'Error al cambiar la contraseña';
          }
          this.error = true;
        }
      });
  }
}
