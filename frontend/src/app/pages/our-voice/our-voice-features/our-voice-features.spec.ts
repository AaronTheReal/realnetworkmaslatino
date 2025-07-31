import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVoiceFeatures } from './our-voice-features';

describe('OurVoiceFeatures', () => {
  let component: OurVoiceFeatures;
  let fixture: ComponentFixture<OurVoiceFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurVoiceFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurVoiceFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
