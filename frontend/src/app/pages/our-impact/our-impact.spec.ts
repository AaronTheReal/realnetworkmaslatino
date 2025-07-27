import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurImpact } from './our-impact';

describe('OurImpact', () => {
  let component: OurImpact;
  let fixture: ComponentFixture<OurImpact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurImpact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurImpact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
