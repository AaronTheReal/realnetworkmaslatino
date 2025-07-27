import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVoice } from './our-voice';

describe('OurVoice', () => {
  let component: OurVoice;
  let fixture: ComponentFixture<OurVoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurVoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurVoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
