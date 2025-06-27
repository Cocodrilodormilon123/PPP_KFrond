import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { ModalEmpresaComponent } from './modal-empresa/modal-empresa.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  @ViewChild('modalEmpresa') modalEmpresa!: ModalEmpresaComponent;

  empresas: any[] = [];

  nuevaEmpresa = {
    nombre: '',
    ruc: '',
    direccion: '',
    distrito: '',
    provincia: '',
    pais: '',
    telefono: '',
    representanteLegal: '',
    estado: 'ACTIVA'
  };

  mostrarFormulario = false;

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.listarEmpresas().subscribe({
      next: (data) => {
        console.log('Empresas cargadas:', data);
        this.empresas = data;
      },
      error: (err) => {
        console.error('Error cargando empresas', err);
      }
    });
  }

  abrirModal(): void {
    this.mostrarFormulario = true;
    this.nuevaEmpresa = {
      nombre: '',
      ruc: '',
      direccion: '',
      distrito: '',
      provincia: '',
      pais: '',
      telefono: '',
      representanteLegal: '',
      estado: 'ACTIVA'
    };
  }

  cerrarModal(): void {
    this.mostrarFormulario = false;
  }

  editarEmpresa(empresa: any): void {
    this.nuevaEmpresa = { ...empresa };
    this.mostrarFormulario = true;
  }

  registrarEmpresa(empresa: any): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datos = JSON.parse(usuario);
      const idPersona = datos.id || datos.idPersona;

      if (!idPersona) {
        alert('No se encontró el ID de la persona en sesión');
        return;
      }

      const empresaConPersona = {
        ...empresa,
        idPersona: idPersona
      };

      this.empresaService.registrarEmpresa(empresaConPersona).subscribe({
        next: () => {
          alert('Empresa registrada con éxito');
          this.cargarEmpresas();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al registrar empresa', err);
          const mensaje = err.error?.message || 'Error al registrar empresa';
          alert(mensaje);
        }
      });
    } else {
      alert('No se encontró información del usuario en sesión');
    }
  }
}
