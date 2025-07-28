import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVoicePanel } from './our-voice-panel';

describe('OurVoicePanel', () => {
  let component: OurVoicePanel;
  let fixture: ComponentFixture<OurVoicePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurVoicePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurVoicePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
