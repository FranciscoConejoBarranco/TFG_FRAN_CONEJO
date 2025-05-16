import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MislistasComponent } from './mislistas.component';

describe('MislistasComponent', () => {
  let component: MislistasComponent;
  let fixture: ComponentFixture<MislistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MislistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MislistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
