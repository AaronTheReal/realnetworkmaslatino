import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedShowsPanel } from './featured-shows-panel';

describe('FeaturedShowsPanel', () => {
  let component: FeaturedShowsPanel;
  let fixture: ComponentFixture<FeaturedShowsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedShowsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedShowsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
