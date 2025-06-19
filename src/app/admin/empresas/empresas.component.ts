import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.http.get<any[]>('http://localhost:4040/oferta-ms/empresas')
      .subscribe({
        next: data => {
          console.log('Empresas cargadas:', data);
          this.empresas = data;
        },
        error: err => console.error('Error cargando empresas', err)
      });
  }
  editarEmpresa(empresa: any) {
  this.nuevaEmpresa = { ...empresa };
  this.mostrarFormulario = true;
  }

  registrarEmpresa() {
    this.http.post('http://localhost:4040/oferta-ms/empresas', this.nuevaEmpresa)
      .subscribe({
        next: () => {
          this.cargarEmpresas();
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
          this.mostrarFormulario = false;
        },
        error: err => console.error('Error al registrar empresa', err)
      });
  }
}
