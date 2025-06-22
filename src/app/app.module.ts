import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

// Componentes principales
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';

// Admin
import { AdminComponent } from './admin/admin.component';
import { EmpresasComponent } from './admin/empresas/empresas.component';
import { OfertasComponent as AdminOfertasComponent } from './admin/ofertas/ofertas.component';
import { PostulacionesComponent as AdminPostulacionesComponent } from './admin/postulaciones/postulaciones.component';
import { EstudianteDetalleComponent } from './admin/estudiante-detalle/estudiante-detalle.component';
import { CrearUsuarioComponent } from './admin/crear-usuario/crear-usuario.component';
import { FormEstudianteComponent } from './admin/form-estudiante/form-estudiante.component';
import { FormAdminComponent } from './admin/form-admin/form-admin.component';
import { ModalOfertaComponent } from './admin/ofertas/modal-oferta/modal-oferta.component';
import { ModalCuposComponent } from './admin/ofertas/modal-cupos/modal-cupos.component';
import { ModalPostulantesComponent } from './admin/ofertas/modal-postulantes/modal-postulantes.component';
import { CambiarClaveComponent } from './admin/cambiar-clave/cambiar-clave.component';

// Estudiante
import { EstudianteComponent } from './estudiante/estudiante.component';
import { PerfilComponent } from './estudiante/perfil/perfil.component';
import { OfertasComponent as EstudianteOfertasComponent } from './estudiante/ofertas/ofertas.component';
import { PostulacionesComponent as EstudiantePostulacionesComponent } from './estudiante/postulaciones/postulaciones.component';
import { PracticasComponent } from './estudiante/practicas/practicas.component';
import { SubirCvComponent } from './estudiante/subir-cv/subir-cv.component';
import { DetalleOfertaComponent } from './estudiante/ofertas/detalle-oferta/detalle-oferta.component';
import { CambiarClaveComponent as EstudianteCambiarClaveComponent } from './estudiante/cambiar-clave/cambiar-clave.component';

// Auth Guard e Interceptor
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Rutas
const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'empresas', component: EmpresasComponent },
      { path: 'ofertas', component: AdminOfertasComponent },
      { path: 'postulaciones', component: AdminPostulacionesComponent },
      { path: 'buscar-estudiante', component: EstudianteDetalleComponent },
      { path: 'crear-usuario', component: CrearUsuarioComponent },
      { path: 'cambiar-clave', component: CambiarClaveComponent },
      { path: '', redirectTo: 'empresas', pathMatch: 'full' }
    ]
  },

  {
    path: 'estudiante',
    component: EstudianteComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { role: 'ESTUDIANTE' },
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'ofertas', component: EstudianteOfertasComponent },
      { path: 'postulaciones', component: EstudiantePostulacionesComponent },
      { path: 'practicas', component: PracticasComponent },
      { path: 'cv', component: SubirCvComponent },
      { path: 'cambiar-clave', component: EstudianteCambiarClaveComponent },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    EmpresasComponent,
    AdminOfertasComponent,
    AdminPostulacionesComponent,
    EstudianteDetalleComponent,
    CrearUsuarioComponent,
    FormEstudianteComponent,
    FormAdminComponent,
    ModalOfertaComponent,
    ModalCuposComponent,
    ModalPostulantesComponent,
    CambiarClaveComponent, // Admin
    EstudianteComponent,
    PerfilComponent,
    EstudianteOfertasComponent,
    EstudiantePostulacionesComponent,
    PracticasComponent,
    SubirCvComponent,
    DetalleOfertaComponent,
    EstudianteCambiarClaveComponent // Estudiante
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
