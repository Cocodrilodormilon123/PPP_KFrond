import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPostulantesComponent } from './modal-postulantes.component';

describe('ModalPostulantesComponent', () => {
  let component: ModalPostulantesComponent;
  let fixture: ComponentFixture<ModalPostulantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPostulantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalPostulantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
