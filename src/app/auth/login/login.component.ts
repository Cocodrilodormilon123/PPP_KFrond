import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user: { username: string; password: string } = {
    username: '',
    password: '',
  };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    console.log('Datos enviados:', this.user);
    this.authService.login(this.user).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);

        try {
          const decoded: any = jwtDecode(res.accessToken);
          const role = decoded.role;
          const idPersona = decoded.idPersona; // 👈 este debe venir del backend

          // Guarda también el ID de la persona
          localStorage.setItem('user', JSON.stringify({ idPersona }));

          if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (role === 'ESTUDIANTE') {
            this.router.navigate(['/estudiante']);
          } else {
            this.error = 'Rol no reconocido';
          }
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
