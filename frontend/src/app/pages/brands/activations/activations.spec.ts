import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activations } from './activations';

describe('Activations', () => {
  let component: Activations;
  let fixture: ComponentFixture<Activations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
