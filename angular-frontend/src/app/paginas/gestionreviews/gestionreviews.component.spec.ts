import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionreviewsComponent } from './gestionreviews.component';

describe('GestionreviewsComponent', () => {
  let component: GestionreviewsComponent;
  let fixture: ComponentFixture<GestionreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionreviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
