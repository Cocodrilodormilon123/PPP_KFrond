import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.css']
})
export class ModalEmpresaComponent {
  @Input() visible = false;
  @Input() empresa: any = {
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

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  registrar() {
    this.guardar.emit(this.empresa);
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
