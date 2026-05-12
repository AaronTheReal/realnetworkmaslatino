import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurPartners } from './our-partners';

describe('OurPartners', () => {
  let component: OurPartners;
  let fixture: ComponentFixture<OurPartners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurPartners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurPartners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
