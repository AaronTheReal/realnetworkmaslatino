import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsPanelComponent } from './about-us-panel.component';

describe('AboutUsPanel', () => {
  let component: AboutUsPanelComponent;
  let fixture: ComponentFixture<AboutUsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
