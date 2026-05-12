import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalReach } from './national-reach';

describe('NationalReach', () => {
  let component: NationalReach;
  let fixture: ComponentFixture<NationalReach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalReach]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalReach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
