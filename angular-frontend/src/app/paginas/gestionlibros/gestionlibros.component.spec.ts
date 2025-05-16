import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionlibrosComponent } from './gestionlibros.component';

describe('GestionlibrosComponent', () => {
  let component: GestionlibrosComponent;
  let fixture: ComponentFixture<GestionlibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionlibrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionlibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
