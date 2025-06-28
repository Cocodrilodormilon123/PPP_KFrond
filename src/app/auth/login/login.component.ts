import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { username: '', password: '' };
  error = '';
  hidePassword = true; // 🔒 Necesario para el botón de visibilidad de la contraseña

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.authService.login(this.user).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);

        try {
          const decoded: any = jwtDecode(res.accessToken);
          const role = decoded.role;
          const idPersona = decoded.idPersona;

          this.authService.getDatosPersona(idPersona).subscribe({
            next: (persona) => {
              const usuario = {
                idPersona,
                nombre: persona.nombre,
                apellido: persona.apellido,
                codigo: persona.codigo,
                foto: persona.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                username: this.user.username
              };

              localStorage.setItem('usuario', JSON.stringify(usuario));

              if (role === 'ADMIN') {
                this.router.navigate(['/admin']);
              } else if (role === 'ESTUDIANTE') {
                this.router.navigate(['/estudiante']);
              } else {
                this.error = 'Rol no reconocido';
              }
            },
            error: (err) => {
              console.error('Error al obtener persona:', err);
              this.error = 'No se pudo obtener los datos del usuario';
            }
          });
        } catch (e) {
          this.error = 'Token inválido';
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
