import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCambiarClaveComponent } from './modal-cambiar-clave.component';

describe('ModalCambiarClaveComponent', () => {
  let component: ModalCambiarClaveComponent;
  let fixture: ComponentFixture<ModalCambiarClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCambiarClaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCambiarClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
