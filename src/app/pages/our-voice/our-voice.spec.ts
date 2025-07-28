import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  OurVoiceComponent } from './our-voice.component';

describe('OurVoice', () => {
  let component: OurVoiceComponent;
  let fixture: ComponentFixture<OurVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurVoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
