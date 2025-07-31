import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVoiceMeet } from './our-voice-meet';

describe('OurVoiceMeet', () => {
  let component: OurVoiceMeet;
  let fixture: ComponentFixture<OurVoiceMeet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurVoiceMeet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurVoiceMeet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
