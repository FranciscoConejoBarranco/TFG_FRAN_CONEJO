import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosRelacionadosComponent } from './libros-relacionados.component';

describe('LibrosRelacionadosComponent', () => {
  let component: LibrosRelacionadosComponent;
  let fixture: ComponentFixture<LibrosRelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosRelacionadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
