import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurPartenrs } from './our-partenrs';

describe('OurPartenrs', () => {
  let component: OurPartenrs;
  let fixture: ComponentFixture<OurPartenrs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurPartenrs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurPartenrs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
