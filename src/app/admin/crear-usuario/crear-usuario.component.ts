import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  animations: [
    trigger('slideToggle', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class CrearUsuarioComponent {
  tipoSeleccionado: string = 'ESTUDIANTE';
}
