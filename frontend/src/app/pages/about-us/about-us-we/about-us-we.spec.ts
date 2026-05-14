import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsWe } from './about-us-we';

describe('AboutUsWe', () => {
  let component: AboutUsWe;
  let fixture: ComponentFixture<AboutUsWe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsWe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsWe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
