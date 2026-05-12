import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowBrands } from './how-brands';

describe('HowBrands', () => {
  let component: HowBrands;
  let fixture: ComponentFixture<HowBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
