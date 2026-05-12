import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpientesCreate } from './serpientes-create';

describe('SerpientesCreate', () => {
  let component: SerpientesCreate;
  let fixture: ComponentFixture<SerpientesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerpientesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerpientesCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
