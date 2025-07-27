import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsPanel } from './about-us-panel';

describe('AboutUsPanel', () => {
  let component: AboutUsPanel;
  let fixture: ComponentFixture<AboutUsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
